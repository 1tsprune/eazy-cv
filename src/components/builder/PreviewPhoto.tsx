interface Props {
  src: string;
  size?: number;
  rounded?: "full" | "xl" | "lg";
  className?: string;
}

export function PreviewPhoto({
  src,
  size = 72,
  rounded = "full",
  className = "",
}: Props) {
  const radius =
    rounded === "full" ? "rounded-full" : rounded === "xl" ? "rounded-xl" : "rounded-lg";

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      className={`object-cover ${radius} ${className}`}
      style={{ width: size, height: size }}
    />
  );
}