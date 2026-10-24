import { useEffect, useRef } from 'react';

/** The A&I logo button (https://appofapp-gh.vercel.app/ai-menu.js). Editing and development actions live inside it. */
export default function AIMenu({ items = [], status = '', ...attrs }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    ref.current.items = items;
    ref.current.status = status;
  }, [items, status]);
  return <ai-menu ref={ref} {...attrs} />;
}
