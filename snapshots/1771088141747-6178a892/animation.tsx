import {
	AbsoluteFill,
	Img,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

export const MyAnimation = () => {
	/*
	 * Animated full-width histogram of Gold Price 2024 with a clear visual hierarchy: header first, then chart grid/axis,
	 * then staggered monthly bars with value labels and a subtle marker line that sweeps across to add polish.
	 * Uses spring-based bar growth and micro hover-like shimmer to avoid a flat "fade-in everything" look.
	 */
	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// Colors
	const COLOR_BG = "#0B0F1A";
	const COLOR_TEXT = "#F8FAFC";
	const COLOR_MUTED = "#94A3B8";
	const COLOR_AXIS = "#243047";
	const COLOR_BAR = "#D4AF37";

	// Text
	const TITLE_TEXT = "Gold Price 2024";
	const UNIT_TEXT = "USD per troy ounce";

	// Timing
	const HEADER_IN_FRAME = 0;
	const CHART_IN_FRAME = 10;
	const BARS_IN_FRAME = 16;
	const STAGGER_FRAMES = 4;
	const VALUE_LABEL_DELAY = 10;
	const SWEEP_IN_FRAME = 24;

	// Outro
	const OUTRO_DURATION_FRAMES = 40;
	const OUTRO_TEXT = "iObserver";
	const OUTRO_TAGLINE = "we track everything";

	// Layout
	const PADDING_X = Math.max(40, Math.round(width * 0.055));
	const PADDING_Y = Math.max(36, Math.round(height * 0.06));
	const HEADER_HEIGHT = Math.max(86, Math.round(height * 0.14));
	const CHART_GAP = Math.max(14, Math.round(width * 0.012));
	const AXIS_LABEL_COL_WIDTH = Math.max(52, Math.round(width * 0.065));
	const X_LABEL_ROW_HEIGHT = Math.max(38, Math.round(height * 0.06));
	const BAR_RADIUS = Math.max(8, Math.round(width * 0.01));
	const GRID_LINE_WIDTH = 1;

	const TITLE_FONT_SIZE = Math.max(28, Math.round(width * 0.034));
	const UNIT_FONT_SIZE = Math.max(14, Math.round(width * 0.016));
	const AXIS_FONT_SIZE = Math.max(12, Math.round(width * 0.013));
	const MONTH_FONT_SIZE = Math.max(11, Math.round(width * 0.012));
	const VALUE_FONT_SIZE = Math.max(11, Math.round(width * 0.012));

	// Data
	const DATA = [
		{ month: "Jan", price: 2039 },
		{ month: "Feb", price: 2024 },
		{ month: "Mar", price: 2160 },
		{ month: "Apr", price: 2330 },
		{ month: "May", price: 2327 },
		{ month: "Jun", price: 2339 },
		{ month: "Jul", price: 2426 },
		{ month: "Aug", price: 2503 },
		{ month: "Sep", price: 2634 },
		{ month: "Oct", price: 2735 },
		{ month: "Nov", price: 2672 },
		{ month: "Dec", price: 2650 },
	];

	// Calculations / derived values
	const prices = DATA.map((d) => d.price);
	const rawMin = Math.min(...prices);
	const rawMax = Math.max(...prices);
	const padding = Math.max(40, Math.round((rawMax - rawMin) * 0.12));

	const MIN_VALUE = Math.floor((rawMin - padding) / 50) * 50;
	const MAX_VALUE = Math.ceil((rawMax + padding) / 50) * 50;

	const CHART_HEIGHT =
		height - PADDING_Y * 2 - HEADER_HEIGHT - Math.max(10, Math.round(height * 0.01));

	const yAxisStepsCount = 5;
	const step = (MAX_VALUE - MIN_VALUE) / yAxisStepsCount;
	const Y_AXIS_STEPS = new Array(yAxisStepsCount + 1)
		.fill(true)
		.map((_, i) => Math.round(MIN_VALUE + i * step));

	const headerIn = spring({
		frame: frame - HEADER_IN_FRAME,
		fps,
		config: { damping: 16, stiffness: 160, mass: 0.9 },
	});

	const chartIn = spring({
		frame: frame - CHART_IN_FRAME,
		fps,
		config: { damping: 18, stiffness: 140, mass: 0.9 },
	});

	const chartOpacity = interpolate(frame, [CHART_IN_FRAME, CHART_IN_FRAME + 14], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const sweep = spring({
		frame: frame - SWEEP_IN_FRAME,
		fps,
		config: { damping: 16, stiffness: 120, mass: 1 },
	});

	const sweepX = interpolate(sweep, [0, 1], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const chartWidth = width - PADDING_X * 2 - AXIS_LABEL_COL_WIDTH - CHART_GAP;

	// Outro (last page)
	const OUTRO_IN_FRAME = Math.max(0, Math.floor((useVideoConfig().durationInFrames ?? 0) - OUTRO_DURATION_FRAMES));
	const outroIn = spring({
		frame: frame - OUTRO_IN_FRAME,
		fps,
		config: { damping: 18, stiffness: 140, mass: 0.9 },
	});
	const outroOpacity = interpolate(frame, [OUTRO_IN_FRAME, OUTRO_IN_FRAME + 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const outroScale = interpolate(outroIn, [0, 1], [0.96, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const chartFadeOut = interpolate(
		frame,
		[Math.max(0, OUTRO_IN_FRAME - 10), OUTRO_IN_FRAME + 6],
		[1, 0],
		{
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		}
	);

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLOR_BG,
				fontFamily: "Abel, sans-serif",
				padding: `${PADDING_Y}px ${PADDING_X}px`,
			}}
		>
			<div style={{ opacity: chartFadeOut }}>
				{/* Header */}
			<div
				style={{
					height: HEADER_HEIGHT,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					transform: `translateY(${(1 - headerIn) * 12}px)`,
					opacity: headerIn,
				}}
			>
				<div
					style={{
						color: COLOR_TEXT,
						fontSize: TITLE_FONT_SIZE,
						fontWeight: 750,
						letterSpacing: -0.6,
						lineHeight: 1.05,
					}}
				>
					{TITLE_TEXT}
				</div>
				<div
					style={{
						marginTop: Math.max(6, Math.round(height * 0.006)),
						color: COLOR_MUTED,
						fontSize: UNIT_FONT_SIZE,
						fontWeight: 500,
					}}
				>
					{UNIT_TEXT}
				</div>
			</div>

			{/* Chart */}
			<div
				style={{
					flex: 1,
					display: "flex",
					gap: CHART_GAP,
					opacity: chartOpacity,
					transform: `translateY(${(1 - chartIn) * 10}px)`,
				}}
			>
				{/* Y Axis labels */}
				<div
					style={{
						width: AXIS_LABEL_COL_WIDTH,
						height: CHART_HEIGHT + X_LABEL_ROW_HEIGHT,
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						paddingBottom: X_LABEL_ROW_HEIGHT,
					}}
				>
					{Y_AXIS_STEPS.slice()
						.reverse()
						.map((val) => (
							<div
								key={val}
								style={{
									color: COLOR_MUTED,
									fontSize: AXIS_FONT_SIZE,
									fontWeight: 600,
									textAlign: "right",
									lineHeight: 1,
									opacity: 0.95,
								}}
							>
								{val.toLocaleString()}
							</div>
						))}
				</div>

				{/* Plot area */}
				<div
					style={{
						position: "relative",
						width: chartWidth,
						height: CHART_HEIGHT + X_LABEL_ROW_HEIGHT,
						display: "flex",
						flexDirection: "column",
					}}
				>
					{/* Grid + bars region */}
					<div
						style={{
							position: "relative",
							height: CHART_HEIGHT,
							width: "100%",
							borderLeft: `${GRID_LINE_WIDTH}px solid ${COLOR_AXIS}`,
							borderBottom: `${GRID_LINE_WIDTH}px solid ${COLOR_AXIS}`,
							overflow: "hidden",
						}}
					>
						{/* Horizontal grid lines */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								display: "flex",
								flexDirection: "column",
								justifyContent: "space-between",
								paddingLeft: Math.max(10, Math.round(width * 0.008)),
							}}
						>
							{Y_AXIS_STEPS.slice()
								.reverse()
								.map((val, idx) => (
									<div
										key={`${val}-${idx}`}
										style={{
											width: "100%",
											borderTop:
												idx === 0 ? "none" : `${GRID_LINE_WIDTH}px solid ${COLOR_AXIS}`,
											opacity: 0.65,
										}}
									/>
								))}
						</div>

						{/* Sweep highlight line */}
						<div
							style={{
								position: "absolute",
								top: 0,
								bottom: 0,
								left: 0,
								width: "100%",
								pointerEvents: "none",
								opacity: interpolate(frame, [SWEEP_IN_FRAME, SWEEP_IN_FRAME + 18], [0, 1], {
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp",
								}),
							}}
						>
							<div
								style={{
									position: "absolute",
									top: 0,
									bottom: 0,
									left: `${Math.round(sweepX * 100)}%`,
									width: 2,
									transform: "translateX(-1px)",
									backgroundColor: `${COLOR_BAR}AA`,
									boxShadow: `0 0 16px ${COLOR_BAR}55`,
								}}
							/>
						</div>

						{/* Bars */}
						<div
							style={{
								position: "absolute",
								inset: 0,
								paddingLeft: Math.max(10, Math.round(width * 0.008)),
								paddingRight: Math.max(10, Math.round(width * 0.008)),
								display: "flex",
								alignItems: "flex-end",
								gap: Math.max(8, Math.round(width * 0.01)),
							}}
						>
							{DATA.map((d, i) => {
								const localDelay = BARS_IN_FRAME + i * STAGGER_FRAMES;
								const barIn = spring({
									frame: frame - localDelay,
									fps,
									config: { damping: 16, stiffness: 120, mass: 0.9 },
								});

								const normalized = (d.price - MIN_VALUE) / (MAX_VALUE - MIN_VALUE);
								const targetHeight = Math.max(2, normalized * (CHART_HEIGHT - 8));
								const barHeight = targetHeight * barIn;

								const lift = interpolate(barIn, [0, 1], [10, 0], {
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp",
								});

								const valueOpacity = interpolate(
									frame,
									[localDelay + VALUE_LABEL_DELAY, localDelay + VALUE_LABEL_DELAY + 10],
									[0, 1],
									{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
								);

								// Micro shimmer once the bar is in (subtle and clamped)
								const shimmer = interpolate(
									frame,
									[localDelay + 18, localDelay + 40],
									[0.0, 1.0],
									{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
								);
								const sheenX = interpolate(shimmer, [0, 1], [-0.2, 1.2], {
									extrapolateLeft: "clamp",
									extrapolateRight: "clamp",
								});

								return (
									<div
										key={d.month}
										style={{
											flex: 1,
											height: "100%",
											display: "flex",
											flexDirection: "column",
											justifyContent: "flex-end",
											alignItems: "stretch",
										}}
									>
										<div
											style={{
												position: "relative",
												height: barHeight,
												transform: `translateY(${lift}px)`,
												backgroundColor: COLOR_BAR,
												borderRadius: `${BAR_RADIUS}px ${BAR_RADIUS}px 0 0`,
												boxShadow: `0 10px 30px ${COLOR_BAR}22`,
												overflow: "hidden",
												minHeight: 2,
											}}
										>
											{/* sheen */}
											<div
												style={{
													position: "absolute",
													top: 0,
													bottom: 0,
													left: `${sheenX * 100}%`,
													width: "38%",
													transform: "translateX(-50%)",
													background:
														"linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0) 100%)",
													opacity: interpolate(barIn, [0, 1], [0, 1], {
														extrapolateLeft: "clamp",
														extrapolateRight: "clamp",
													}),
													mixBlendMode: "overlay",
												}}
											/>

											{/* value label (inside when possible, otherwise above) */}
											{barHeight > 34 ? (
												<div
													style={{
														position: "absolute",
														top: 10,
														left: 0,
														right: 0,
														textAlign: "center",
														color: COLOR_BG,
														fontSize: VALUE_FONT_SIZE,
														fontWeight: 800,
														opacity: valueOpacity,
														letterSpacing: 0.2,
													}}
												>
													{d.price.toLocaleString()}
												</div>
											) : (
												<div
													style={{
														position: "absolute",
														top: -Math.max(18, Math.round(height * 0.02)),
														left: 0,
														right: 0,
														textAlign: "center",
														color: COLOR_TEXT,
														fontSize: VALUE_FONT_SIZE,
														fontWeight: 800,
														opacity: valueOpacity,
														textShadow: `0 2px 10px rgba(0,0,0,0.35)`,
														letterSpacing: 0.2,
													}}
												>
													{d.price.toLocaleString()}
												</div>
											)}
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* X labels */}
					<div
						style={{
							height: X_LABEL_ROW_HEIGHT,
							width: "100%",
							display: "flex",
							alignItems: "flex-end",
							paddingLeft: Math.max(10, Math.round(width * 0.008)),
							paddingRight: Math.max(10, Math.round(width * 0.008)),
							gap: Math.max(8, Math.round(width * 0.01)),
						}}
					>
						{DATA.map((d, i) => {
							const labelDelay = BARS_IN_FRAME + i * STAGGER_FRAMES + 6;
							const labelIn = spring({
								frame: frame - labelDelay,
								fps,
								config: { damping: 20, stiffness: 220, mass: 0.7 },
							});

							return (
								<div
									key={`label-${d.month}`}
									style={{
										flex: 1,
										textAlign: "center",
										color: COLOR_MUTED,
										fontSize: MONTH_FONT_SIZE,
										fontWeight: 700,
										transform: `translateY(${(1 - labelIn) * 6}px)`,
										opacity: labelIn,
										letterSpacing: 0.6,
									}}
								>
									{d.month.toUpperCase()}
								</div>
							);
						})}
					</div>
				</div>
			</div>

			</div>

			{/* Outro page */}
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					opacity: outroOpacity,
					pointerEvents: "none",
					transform: `scale(${outroScale})`,
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: Math.max(10, Math.round(height * 0.012)),
					}}
				>
					<Img
						src={AttachedImages[0]}
						style={{
							width: Math.max(84, Math.round(width * 0.11)),
							height: "auto",
							filter: `drop-shadow(0 16px 40px rgba(0,0,0,0.45))`,
							opacity: outroIn,
						}}
					/>

					<div
						style={{
							color: COLOR_TEXT,
							fontSize: Math.max(34, Math.round(width * 0.05)),
							fontWeight: 850,
							letterSpacing: -0.8,
							lineHeight: 1.05,
							textAlign: "center",
						}}
					>
						{OUTRO_TEXT}
					</div>

					<div
						style={{
							color: COLOR_MUTED,
							fontSize: Math.max(16, Math.round(width * 0.022)),
							fontWeight: 600,
							letterSpacing: 0.2,
							textAlign: "center",
							maxWidth: Math.round(width * 0.75),
						}}
					>
						{OUTRO_TAGLINE}
					</div>
				</div>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};