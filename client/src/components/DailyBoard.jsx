import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import dailyBoard from '../data/dailyBoard';
import { fetchBillboardHistory } from '../utils/publicApi';
import { billboardLabel, billboardNavigation } from '../utils/billboardNavigation';

const COLOMBO_DATE = new Intl.DateTimeFormat('en-LK', {
  timeZone: 'Asia/Colombo',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const fallbackBoard = { ...dailyBoard, _id: 'fallback', active: true, date: null, fallback: true };

export default function DailyBoard() {
  const [boards, setBoards] = useState([fallbackBoard]);
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState({ loading: true, error: '', empty: false });
  const [imageFailed, setImageFailed] = useState(false);
  const [retryVersion, setRetryVersion] = useState(0);

  useEffect(() => {
    let active = true;
    setStatus({ loading: true, error: '', empty: false });
    fetchBillboardHistory()
      .then(items => {
        if (!active) return;
        if (!items.length) {
          setStatus({ loading: false, error: '', empty: true });
          return;
        }
        setBoards(items);
        setIndex(0);
        setStatus({ loading: false, error: '', empty: false });
      })
      .catch(error => {
        if (!active) return;
        if (import.meta.env.DEV) {
          console.error('[DailyBoard] Board history request failed.', {
            endpoint: error.endpoint || '/api/billboards/history',
            status: error.status || 'network-error',
            message: error.message,
          });
        }
        setStatus({ loading: false, error: error.message, empty: false });
      });
    return () => { active = false; };
  }, [retryVersion]);

  const board = boards[index] || fallbackBoard;
  const usingFallbackImage = board.fallback || imageFailed;
  const label = billboardLabel(board, index);
  const date = board.date ? COLOMBO_DATE.format(new Date(board.date)) : '';
  const navigation = billboardNavigation(index, boards.length);
  const showNavigation = navigation.showNavigation && !board.fallback;
  const changeBoard = nextIndex => {
    setIndex(nextIndex);
    setImageFailed(false);
  };
  const retry = () => {
    setBoards([fallbackBoard]);
    setIndex(0);
    setImageFailed(false);
    setRetryVersion(value => value + 1);
  };
  const onlyBoard = !status.loading && !status.error && !status.empty && boards.length === 1 && !board.fallback;

  return (
    <aside className="daily-board" aria-label={`${label}${date ? `, ${date}` : ''}`}>
      <div className="daily-board__media">
        <div className="daily-board__viewport">
          <img
            className={usingFallbackImage ? dailyBoard.cropClass : undefined}
            src={usingFallbackImage ? dailyBoard.image : board.image}
            alt={usingFallbackImage ? dailyBoard.alt : board.caption || label}
            loading="eager"
            onError={() => setImageFailed(true)}
          />
        </div>
        {showNavigation && <nav className="daily-board__navigation" aria-label="Billboard history navigation">
          <button type="button" className="daily-board__nav daily-board__nav--previous" onClick={() => changeBoard(navigation.olderIndex)} disabled={navigation.atOldest} aria-label="Previous board"><ChevronLeft aria-hidden="true" /></button>
          <button type="button" className="daily-board__nav daily-board__nav--next" onClick={() => changeBoard(navigation.newerIndex)} disabled={navigation.atNewest} aria-label="Next board"><ChevronRight aria-hidden="true" /></button>
        </nav>}
      </div>
      <div className="daily-board__details" aria-live="polite">
        <div><strong>{label}</strong>{date && <time dateTime={String(board.date).slice(0, 10)}>{date}</time>}</div>
        {board.caption && <p>{board.caption}</p>}
        {status.loading && <span>Loading board history…</span>}
        {status.empty && <span>No uploaded boards are available. Showing the saved board.</span>}
        {onlyBoard && <span>No previous boards yet.</span>}
        {status.error && <span className="daily-board__error">Board history could not be loaded. Showing the saved board. <button type="button" onClick={retry}>Retry</button></span>}
        {imageFailed && <span>This board image could not be loaded. Showing the saved board.</span>}
      </div>
    </aside>
  );
}
