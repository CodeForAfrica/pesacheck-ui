import type { CSSProperties } from "react";

/**
 * Lightweight icon renderer for the SVGs exported from Figma into /public/icons.
 * Tiny vector assets render fine as plain <img>; this avoids next/image overhead
 * for sub-24px icons while keeping a single import surface.
 */
export function Icon({
	name,
	size = 20,
	className,
	style,
	alt = "",
}: {
	name: string;
	size?: number;
	className?: string;
	style?: CSSProperties;
	alt?: string;
}) {
	return (
		// biome-ignore lint/performance/noImgElement: small icons don't benefit from next/image optimization
		<img
			src={`/icons/${name}.svg`}
			alt={alt}
			width={size}
			height={size}
			className={className}
			style={style}
			aria-hidden={alt === "" ? true : undefined}
		/>
	);
}
