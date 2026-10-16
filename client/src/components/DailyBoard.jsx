import { useEffect, useState } from 'react';
import { apiEnabled } from '../data/business';
import dailyBoard from '../data/dailyBoard';
import { fetchCurrentBillboard } from '../utils/publicApi';

export default function DailyBoard() {
  const [board, setBoard] = useState(dailyBoard);

  useEffect(() => {
    if (!apiEnabled) return undefined;
    let active = true;
    fetchCurrentBillboard()
      .then(item => {
        if (active && item) setBoard({ image: item.image, alt: item.caption, caption: item.caption, cropClass: '' });
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <aside className="daily-board" aria-label={board.caption}>
      <div className="daily-board__viewport">
        <img
          className={board.cropClass || undefined}
          src={board.image}
          alt={board.alt}
          loading="eager"
        />
      </div>
    </aside>
  );
}
