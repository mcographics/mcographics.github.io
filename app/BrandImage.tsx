type BrandImageProps = {
  alt: string;
  variant?: "mark" | "community";
};

const markSourceSet = [48, 96, 144]
  .map((width) => `/optimized/brand/majestic-lion-${width}.webp ${width}w`)
  .join(", ");
const communitySourceSet = [512, 1024, 1920]
  .map((width) => `/optimized/brand/majestic-lion-${width}.webp ${width}w`)
  .join(", ");

export default function BrandImage({ alt, variant = "mark" }: BrandImageProps) {
  const isCommunity = variant === "community";

  return (
    <picture className={isCommunity ? "community-brand-image" : "brand-image--mark"}>
      <source
        type="image/webp"
        srcSet={isCommunity ? communitySourceSet : markSourceSet}
        sizes={isCommunity
          ? "(max-width: 900px) 1px, 29vw"
          : "(max-width: 480px) 32px, (max-width: 760px) 36px, 42px"}
      />
      <img
        className={isCommunity ? undefined : "brand-logo"}
        src="/brand/majestic-lion.png"
        alt={alt}
        width={isCommunity ? 3000 : 48}
        height={isCommunity ? 3000 : 48}
        loading={isCommunity ? "lazy" : "eager"}
        decoding="async"
      />
    </picture>
  );
}
