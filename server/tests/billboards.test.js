import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Billboard from '../models/Billboard.js';
import { billboardHistory, createBillboard, deleteBillboard, updateBillboard } from '../controllers/billboards.js';

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('public billboard history requests every saved record in stable upload order', async () => {
  const oldState = mongoose.connection.readyState;
  const find = Billboard.find;
  const captured = {};
  try {
    mongoose.connection.readyState = 1;
    Billboard.find = filter => {
      captured.filter = filter;
      const query = {
        select(fields) { captured.fields = fields; return query; },
        sort(order) { captured.order = order; return query; },
        lean: async () => [
          { _id: 'c', image: '/c.jpg', caption: 'C', date: new Date(), active: true },
          { _id: 'b', image: '/b.jpg', caption: 'B', date: new Date(), active: false },
          { _id: 'a', image: '/a.jpg', caption: 'A', date: new Date(), active: false },
        ],
      };
      return query;
    };
    const res = responseRecorder();
    await billboardHistory({}, res);
    assert.deepEqual(captured.filter, undefined);
    assert.deepEqual(captured.order, { createdAt: -1, _id: -1 });
    assert.equal(captured.fields, '_id image caption date');
    assert.equal(res.payload.billboards.length, 3);
    assert.deepEqual(res.payload.billboards.map(board => board.caption), ['C', 'B', 'A']);
  } finally {
    mongoose.connection.readyState = oldState;
    Billboard.find = find;
  }
});

test('public billboard history returns an empty list when nothing is saved', async () => {
  const oldState = mongoose.connection.readyState;
  const find = Billboard.find;
  try {
    mongoose.connection.readyState = 1;
    Billboard.find = () => {
      const query = {
        select() { return query; },
        sort() { return query; },
        lean: async () => [],
      };
      return query;
    };
    const res = responseRecorder();
    await billboardHistory({}, res);
    assert.deepEqual(res.payload, { billboards: [] });
  } finally {
    mongoose.connection.readyState = oldState;
    Billboard.find = find;
  }
});

test('public billboard history reports a database outage', async () => {
  const oldState = mongoose.connection.readyState;
  try {
    mongoose.connection.readyState = 0;
    const res = responseRecorder();
    await billboardHistory({}, res);
    assert.equal(res.statusCode, 503);
    assert.equal(res.payload.message, 'The daily board history is temporarily unavailable.');
  } finally {
    mongoose.connection.readyState = oldState;
  }
});

test('creating a billboard makes it current and preserves older records', async () => {
  const updateMany = Billboard.updateMany;
  const create = Billboard.create;
  let deactivation;
  let created;
  try {
    Billboard.updateMany = async (filter, update) => { deactivation = { filter, update }; };
    Billboard.create = async values => { created = values; return values; };
    const res = responseRecorder();
    await createBillboard({ file: { filename: 'board.jpg' }, body: { caption: 'Current' } }, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(deactivation, { filter: { active: true }, update: { active: false } });
    assert.equal(created.active, true);
    assert.equal('publishedAt' in created, false);
  } finally {
    Billboard.updateMany = updateMany;
    Billboard.create = create;
  }
});

test('editing a billboard does not change its current state or original upload order', async () => {
  const isObjectIdOrHexString = mongoose.isObjectIdOrHexString;
  const findById = Billboard.findById;
  const createdAt = new Date('2025-01-01T00:00:00.000Z');
  const board = {
    _id: '507f1f77bcf86cd799439011',
    image: '/old.jpg',
    caption: 'Old caption',
    date: new Date('2025-01-02T00:00:00.000Z'),
    active: false,
    createdAt,
    async save() { return this; },
  };
  try {
    mongoose.isObjectIdOrHexString = () => true;
    Billboard.findById = async () => board;
    const res = responseRecorder();
    await updateBillboard({ params: { id: board._id }, body: { caption: 'Edited', date: '2026-10-19', active: 'true', published: 'false' } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(board.caption, 'Edited');
    assert.equal(board.active, false);
    assert.equal(board.createdAt, createdAt);
  } finally {
    mongoose.isObjectIdOrHexString = isObjectIdOrHexString;
    Billboard.findById = findById;
  }
});

test('deleting the current billboard promotes the newest remaining upload', async () => {
  const findByIdAndDelete = Billboard.findByIdAndDelete;
  const findOneAndUpdate = Billboard.findOneAndUpdate;
  let promotion;
  try {
    Billboard.findByIdAndDelete = async () => ({ active: true });
    Billboard.findOneAndUpdate = async (filter, update, options) => { promotion = { filter, update, options }; };
    const res = responseRecorder();
    await deleteBillboard({ params: { id: '507f1f77bcf86cd799439011' } }, res);
    assert.deepEqual(promotion, {
      filter: {},
      update: { active: true },
      options: { sort: { createdAt: -1, _id: -1 } },
    });
    assert.equal(res.statusCode, 200);
  } finally {
    Billboard.findByIdAndDelete = findByIdAndDelete;
    Billboard.findOneAndUpdate = findOneAndUpdate;
  }
});
