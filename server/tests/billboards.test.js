import test from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import Billboard from '../models/Billboard.js';
import { createBillboard, publishedBillboardHistory } from '../controllers/billboards.js';

function responseRecorder() {
  return {
    statusCode: 200,
    payload: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.payload = payload; return this; },
  };
}

test('public billboard history requests only published records in stable newest-first order', async () => {
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
        limit(value) { captured.limit = value; return query; },
        lean: async () => [{ _id: 'published', image: '/board.jpg', caption: 'Published', date: new Date(), active: true }],
      };
      return query;
    };
    const res = responseRecorder();
    await publishedBillboardHistory({}, res);
    assert.deepEqual(captured.filter, { publishedAt: { $ne: null } });
    assert.deepEqual(captured.order, { date: -1, createdAt: -1, _id: -1 });
    assert.equal(captured.fields, '_id image caption date active');
    assert.equal(captured.limit, 200);
    assert.equal(res.payload.billboards.length, 1);
  } finally {
    mongoose.connection.readyState = oldState;
    Billboard.find = find;
  }
});

test('public billboard history returns an empty list when nothing is published', async () => {
  const oldState = mongoose.connection.readyState;
  const find = Billboard.find;
  try {
    mongoose.connection.readyState = 1;
    Billboard.find = () => {
      const query = {
        select() { return query; },
        sort() { return query; },
        limit() { return query; },
        lean: async () => [],
      };
      return query;
    };
    const res = responseRecorder();
    await publishedBillboardHistory({}, res);
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
    await publishedBillboardHistory({}, res);
    assert.equal(res.statusCode, 503);
    assert.equal(res.payload.message, 'The daily board history is temporarily unavailable.');
  } finally {
    mongoose.connection.readyState = oldState;
  }
});

test('creating a current billboard publishes it and preserves older records', async () => {
  const updateMany = Billboard.updateMany;
  const create = Billboard.create;
  let deactivation;
  let created;
  try {
    Billboard.updateMany = async (filter, update) => { deactivation = { filter, update }; };
    Billboard.create = async values => { created = values; return values; };
    const res = responseRecorder();
    await createBillboard({ file: { filename: 'board.jpg' }, body: { active: 'true', published: 'true', caption: 'Current' } }, res);
    assert.equal(res.statusCode, 201);
    assert.deepEqual(deactivation, { filter: { active: true }, update: { active: false } });
    assert.equal(created.active, true);
    assert.ok(created.publishedAt instanceof Date);
  } finally {
    Billboard.updateMany = updateMany;
    Billboard.create = create;
  }
});

test('creating an unpublished billboard keeps it private', async () => {
  const create = Billboard.create;
  let created;
  try {
    Billboard.create = async values => { created = values; return values; };
    const res = responseRecorder();
    await createBillboard({ file: { filename: 'draft.jpg' }, body: { active: 'false', published: 'false', caption: 'Draft' } }, res);
    assert.equal(res.statusCode, 201);
    assert.equal(created.active, false);
    assert.equal(created.publishedAt, null);
  } finally {
    Billboard.create = create;
  }
});
