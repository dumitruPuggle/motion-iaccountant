import React from "react";
import {
	AbsoluteFill,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const MyAnimation: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// DATA
	const chart = {
		title: "Gold Price 2024",
		unit: "USD per troy ounce",
		data: [
			{month: "Jan", price: 2039},
			{month: "Feb", price: 2024},
			{month: "Mar", price: 2160},
			{month: "Apr", price: 2330},
			{month: "May", price: 2327},
			{month: "Jun", price: 2339},
			{month: "Jul", price: 2426},
			{month: "Aug", price: 2503},
			{month: "Sep", price: 2634},
			{month: "Oct", price: 2735},
			{month: "Nov", price: 2672},
			{month: "Dec", price: 2650},
		],
	};

	const prices = chart.data.map((d) => d.price);
	const minV = Math.min(...prices);
	const maxV = Math.max(...prices);
	const range = Math.max(1, maxV - minV);

	// COLORS (premium dark + gold)
	const BG = "#070A12";
	const TEXT = "rgba(245,247,255,0.92)";
	const MUTED = "rgba(245,247,255,0.65)";
	const GRID = "rgba(245,247,255,0.10)";
	const GRID_STRONG = "rgba(245,247,255,0.16)";
	const GOLD_A = "#FFD36A";
	const GOLD_B = "#FFB200";

	// LAYOUT
	const PADDING = Math.max(44, Math.round(width * 0.06));
	const titleSize = Math.max(44, Math.round(width * 0.055));
	const unitSize = Math.max(18, Math.round(width * 0.02));
	const labelSize = Math.max(16, Math.round(width * 0.017));
	const valueSize = Math.max(16, Math.round(width * 0.018));

	const chartTop = PADDING + Math.round(titleSize * 1.35);
	const chartBottom = height - PADDING - Math.round(labelSize * 2.2);
	const chartLeft = PADDING;
	const chartRight = width - PADDING;
	const chartW = chartRight - chartLeft;
	const chartH = chartBottom - chartTop;

	const n = chart.data.length;
	const gap = Math.max(10, Math.round(chartW * 0.012));
	const barW = Math.max(14, Math.floor((chartW - gap * (n - 1)) / n));

	// INTRO
	const intro = spring({
		frame,
		fps,
		config: {damping: 14, stiffness: 120, mass: 0.9},
	});
	const fadeIn = interpolate(frame, [0, 18], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Highlight the maximum month subtly
	const maxIndex = prices.indexOf(maxV);

	// Current bar highlight sweep (subtle)
	const sweep = interpolate(frame, [25, 25 + fps * 2], [-0.25, 1.25], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Grid lines
	const gridLines = 5;
	const ticks = new Array(gridLines + 1).fill(true).map((_, i) => {
		const t = i / gridLines;
		const value = Math.round(maxV - t * range);
		const y = chartTop + t * chartH;
		return {t, value, y};
	});

	// Last visible (for callout)
	const last = chart.data[chart.data.length - 1];
	const lastAppear = spring({
		frame: frame - 55,
		fps,
		config: {damping: 18, stiffness: 160},
	});
	const lastOpacity = interpolate(frame, [55, 70], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<AbsoluteFill
			style={{
				backgroundColor: BG,
				fontFamily:
					"system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
				overflow: "hidden",
			}}
		>
			{/* Ambient glow */}
			<div
				style={{
					position: "absolute",
					inset: -120,
					opacity: 0.9 * fadeIn,
					filter: "blur(10px)",
				}}
			>
				<div
					style={{
						position: "absolute",
						top: -height * 0.2,
						left: -width * 0.2,
						width: width * 0.7,
						height: width * 0.7,
						borderRadius: 9999,
						background:
							"radial-gradient(circle at 30% 30%, rgba(255,178,0,0.22), rgba(255,178,0,0))",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: -height * 0.25,
						right: -width * 0.25,
						width: width * 0.75,
						height: width * 0.75,
						borderRadius: 9999,
						background:
							"radial-gradient(circle at 60% 60%, rgba(255,211,106,0.14), rgba(255,211,106,0))",
					}}
				/>
			</div>

			<AbsoluteFill
				style={{
					padding: PADDING,
					opacity: fadeIn,
					transform: `translateY(${(1 - intro) * 18}px)`,
				}}
			>
				{/* Title */}
				<div style={{marginBottom: Math.round(titleSize * 0.25)}}>
					<div
						style={{
							fontSize: titleSize,
							fontWeight: 900,
							letterSpacing: -1.1,
							color: TEXT,
							lineHeight: 1.05,
						}}
					>
						{chart.title}
					</div>
					<div
						style={{
							marginTop: 8,
							fontSize: unitSize,
							fontWeight: 650,
							color: MUTED,
						}}
					>
						{chart.unit}
					</div>
				</div>

				{/* Plot area */}
				<div
					style={{
						position: "absolute",
						left: chartLeft,
						top: chartTop,
						width: chartW,
						height: chartH,
					}}
				>
					{/* Grid + y labels */}
					{ticks.map((tick, i) => {
						const isTopOrBottom = i === 0 || i === ticks.length - 1;
						return (
							<div key={`grid-${i}`}>
								<div
									style={{
										position: "absolute",
										left: 0,
										right: 0,
										top: tick.y - chartTop,
										height: 1,
										backgroundColor: isTopOrBottom ? GRID_STRONG : GRID,
										opacity: 0.9,
									}}
								/>
								<div
									style={{
										position: "absolute",
										left: -Math.max(90, Math.round(width * 0.09)),
										top: tick.y - chartTop - Math.round(labelSize * 0.65),
										width: Math.max(86, Math.round(width * 0.085)),
										textAlign: "right",
										fontSize: labelSize,
										fontWeight: 650,
										color: "rgba(245,247,255,0.55)",
										letterSpacing: -0.2,
									}}
								>
									{tick.value.toLocaleString()}
								</div>
							</div>
						);
					})}

					{/* Bars */}
					{chart.data.map((d, i) => {
						const baseDelay = 18;
						const stagger = 4;
						const barIn = spring({
							frame: frame - (baseDelay + i * stagger),
							fps,
							config: {damping: 16, stiffness: 140, mass: 0.9},
						});
						const barOpacity = interpolate(
							frame,
							[baseDelay + i * stagger - 8, baseDelay + i * stagger + 10],
							[0, 1],
							{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
						);

						const normalized = (d.price - minV) / range;
						const targetH = Math.max(6, normalized * chartH);
						const h = targetH * barIn;

						const x = i * (barW + gap);
						const y = chartH - h;

						const isMax = i === maxIndex;
						const sweepMaskX = sweep * chartW;
						const highlight = isMax
							? 0.55
							: interpolate(frame, [0, 90], [0.12, 0.18], {
								extrapolateLeft: "clamp",
								extrapolateRight: "clamp",
							});

						return (
							<div
								key={`${d.month}-${i}`}
								style={{position: "absolute", left: x, top: 0}}
							>
								<div
									style={{
										position: "absolute",
										left: 0,
										top: y,
										width: barW,
										height: h,
										borderRadius: Math.max(10, Math.round(barW * 0.25)),
										background: `linear-gradient(180deg, ${GOLD_A}, ${GOLD_B})`,
										opacity: barOpacity,
										boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
										overflow: "hidden",
									}}
								>
									{/* subtle moving shine */}
									<div
										style={{
											position: "absolute",
											top: -chartH * 0.1,
											left: sweepMaskX - x - barW * 0.9,
											width: barW * 1.2,
											height: chartH * 1.2,
											background:
												"linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.24), rgba(255,255,255,0))",
											transform: "rotate(18deg)",
											opacity: highlight,
											pointerEvents: "none",
										}}
									/>
								</div>

								{/* value label (appears after bar settles) */}
								<div
									style={{
										position: "absolute",
										left: barW / 2,
										top: Math.max(0, y - Math.round(valueSize * 1.15)),
										transform: `translateX(-50%) translateY(${(1 - barIn) * 8}px)`,
										fontSize: valueSize,
										fontWeight: 800,
										letterSpacing: -0.3,
										color: "rgba(245,247,255,0.92)",
										opacity: interpolate(
											frame,
											[baseDelay + i * stagger + 8, baseDelay + i * stagger + 18],
											[0, 1],
											{
												extrapolateLeft: "clamp",
												extrapolateRight: "clamp",
											}
										),
										textShadow: "0 10px 26px rgba(0,0,0,0.45)",
										whiteSpace: "nowrap",
									}}
								>
									{d.price.toLocaleString()}
								</div>

								{/* month label */}
								<div
									style={{
										position: "absolute",
										left: barW / 2,
										top: chartH + Math.round(labelSize * 0.65),
										transform: "translateX(-50%)",
										fontSize: labelSize,
										fontWeight: 700,
										color: "rgba(245,247,255,0.70)",
										letterSpacing: -0.2,
										opacity: barOpacity,
									}}
								>
									{d.month}
								</div>
							</div>
						);
					})}

					{/* Axis baseline */}
					<div
						style={{
							position: "absolute",
							left: 0,
							right: 0,
							bottom: 0,
							height: 1,
							backgroundColor: GRID_STRONG,
						}}
					/>
				</div>

				{/* Small callout for last value */}
				<div
					style={{
						position: "absolute",
						right: PADDING,
						top: PADDING + Math.round(titleSize * 0.2),
						padding: `${Math.max(10, Math.round(height * 0.012))}px ${Math.max(
							14,
							Math.round(width * 0.016)
						)}px`,
						borderRadius: 999,
						border: "1px solid rgba(255,211,106,0.35)",
						background:
							"linear-gradient(135deg, rgba(255,178,0,0.18), rgba(245,247,255,0.04))",
						color: TEXT,
						fontWeight: 800,
						fontSize: Math.max(18, Math.round(width * 0.02)),
						letterSpacing: -0.3,
						opacity: lastOpacity,
						transform: `translateY(${(1 - lastAppear) * 10}px)`,
						boxShadow: "0 18px 44px rgba(0,0,0,0.35)",
					}}
				>
					<span style={{color: "rgba(245,247,255,0.70)", fontWeight: 700}}>
						Dec:
					</span>{" "}
					<span style={{color: GOLD_A}}>{last.price.toLocaleString()}</span>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
