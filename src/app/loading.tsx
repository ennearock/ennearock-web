import { LogoMark } from "@/components/logo";

export default function Loading() {
  return <div aria-label="Loading page" className="page-loader" role="status"><LogoMark /><span>Loading Ennearock</span></div>;
}
