import { business } from '../data/business';
export default function Brand(){return <a className="brand" href="#home" aria-label="Amil Auto Hub home">{business.logo?<img src={business.logo} alt="Amil Auto Hub"/>:<><span className="brand-symbol" aria-hidden="true">A<span>///</span></span><span className="brand-words">AMIL <b>AUTO HUB</b><small>WE CARE FOR YOUR VEHICLE</small></span></>}</a>}
