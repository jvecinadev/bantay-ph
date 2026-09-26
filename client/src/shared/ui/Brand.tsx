import { Link } from "react-router-dom";
import Logo from "../../assets/logo.png";
import { ROUTES } from "../../app/router/routes";

const Brand = () => (
  <Link
    to={ROUTES.feed}
    aria-label="Bantay PH feed"
    className="flex min-w-0 items-center gap-2.5 rounded-lg transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
  >
    <img
      src={Logo}
      alt=""
      draggable={false}
      className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
    />
    <span className="min-w-0 leading-tight">
      <span className="block truncate text-sm font-bold tracking-tight text-text-primary">
        Bantay PH
      </span>
      <span className="hidden truncate text-[11px] text-text-secondary sm:block">
        Community Issue Reporting
      </span>
    </span>
  </Link>
);

export default Brand;