import { Image, type Styles } from "@react-pdf/renderer";

export function PdfPhoto({
  src,
  style,
}: {
  src: string;
  style: Styles[keyof Styles];
}) {
  if (!src) return null;
  return <Image src={src} style={style} />;
}