import { MessageCircle } from 'lucide-react';
import { business } from '../data/business';
export default function ContactAction({className='',children='WhatsApp Us'}){const url=business.whatsapp?`https://wa.me/${business.whatsapp.replace(/\D/g,'')}?text=${encodeURIComponent('Hi Amil Auto Hub! I am looking for a spare part.')}`:'#contact';return <a className={className} href={url} {...(business.whatsapp?{target:'_blank',rel:'noopener noreferrer'}:{})}><MessageCircle size={19}/>{children}</a>}
