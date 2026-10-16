import { MessageCircle } from 'lucide-react';
import { business } from '../data/business';

export default function ContactAction({ className = '', children = 'WhatsApp Us' }) {
  return (
    <a className={className} href={business.whatsappLink} target="_blank" rel="noopener noreferrer">
      <MessageCircle size={19} />
      {children}
    </a>
  );
}
