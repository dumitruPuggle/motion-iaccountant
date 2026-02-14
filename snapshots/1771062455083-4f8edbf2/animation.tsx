import React, {useMemo} from "react";
import {
	useCurrentFrame,
	useVideoConfig,
	AbsoluteFill,
	interpolate,
	spring,
	Easing,
} from "remotion";
import {Img} from "remotion";
import {
	TransitionSeries,
	linearTiming,
	springTiming,
} from "@remotion/transitions";
import {fade} from "@remotion/transitions/fade";
import {slide} from "@remotion/transitions/slide";

declare const AttachedImages: string[];

export const MyAnimation = () => {
	/*
	 * Intro animation for iAccountant using the provided logo as the hero element.
	 * The sequence builds a premium brand moment: logo + wordmark entrance, then a feature/value line and CTA.
	 * Added an animated histogram (Gold Price 2024) as an additional clean, no-card scene.
	 */

	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();

	// COLORS
	const COLOR_BG = "#0B1020";
	const COLOR_TEXT = "#F4F7FF";
	const COLOR_MUTED = "rgba(244,247,255,0.72)";
	const COLOR_ACCENT = "#6EE7FF";
	const COLOR_GOLD = "#F5C542";
	const COLOR_GOLD_SOFT = "rgba(245,197,66,0.25)";

	// TEXT
	const APP_NAME_TEXT = "iAccountant";
	const TAGLINE_TEXT = "Invoices. Expenses. Reports. Done.";
	const VALUE_LINE_TEXT = "Your clean, fast accounting companion.";
	const CTA_TEXT = "Get started";
	const FINAL_CTA_TEXT = "Try it now!";

	// DATA (Histogram)
	const GOLD = {
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

	// TIMING
	const SCENE_1_DURATION = 95;
	const TRANSITION_1_DURATION = 16;
	const SCENE_2_DURATION = 95;
	const TRANSITION_2_DURATION = 16;
	const SCENE_3_DURATION = 80;
	const TRANSITION_3_DURATION = 16;
	const SCENE_4_DURATION = 150;

	const LOGO_IN_DELAY = 6;
	const NAME_IN_DELAY = 14;
	const TAGLINE_IN_DELAY = 26;

	const SCENE_2_HEADLINE_DELAY = 10;
	const SCENE_2_CHIPS_DELAY = 22;
	const SCENE_2_CTA_DELAY = 34;
	const SWEEP_START_DELAY = 40;
	const SWEEP_DURATION = 22;

	// LAYOUT
	const PADDING = Math.max(48, Math.round(width * 0.06));

	const LOGO_SIZE = Math.max(88, Math.round(width * 0.12));
	const TITLE_SIZE = Math.max(54, Math.round(width * 0.06));
	const TAGLINE_SIZE = Math.max(24, Math.round(width * 0.022));
	const BODY_SIZE = Math.max(26, Math.round(width * 0.026));
	const CHIP_TEXT_SIZE = Math.max(18, Math.round(width * 0.018));
	const CTA_TEXT_SIZE = Math.max(20, Math.round(width * 0.02));

	const GRID_GAP = Math.max(18, Math.round(width * 0.018));
	const CHIP_GAP = Math.max(12, Math.round(width * 0.012));
	const CHIP_PAD_Y = Math.max(10, Math.round(height * 0.012));
	const CHIP_PAD_X = Math.max(14, Math.round(width * 0.016));

	const CTA_PAD_Y = Math.max(12, Math.round(height * 0.016));
	const CTA_PAD_X = Math.max(18, Math.round(width * 0.02));
	const CTA_RADIUS = Math.max(14, Math.round(width * 0.014));

	// Calculations & derived values (global ambient)
	const totalMainDuration =
		SCENE_1_DURATION + SCENE_2_DURATION + SCENE_3_DURATION + SCENE_4_DURATION;
	const bgGlowOpacity = interpolate(frame, [0, 25], [0.0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const subtleParallaxX = interpolate(frame, [0, totalMainDuration], [-18, 18], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const subtleParallaxY = interpolate(frame, [0, totalMainDuration], [14, -14], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	// Ambient glows: fixed inset (independent of content padding)
	const GLOW_INSET = -Math.max(160, Math.round(Math.min(width, height) * 0.18));

	const SceneOne = () => {
		/*
		 * Scene 1: Brand reveal. Logo pops in with depth, followed by the app name and a crisp tagline.
		 * Clean (no cards/boxes).
		 */

		const f = useCurrentFrame();

		const logoIn = spring({
			frame: f - LOGO_IN_DELAY,
			fps,
			config: {damping: 14, stiffness: 180, mass: 0.8},
		});

		const nameIn = spring({
			frame: f - NAME_IN_DELAY,
			fps,
			config: {damping: 16, stiffness: 160, mass: 0.9},
		});

		const taglineIn = spring({
			frame: f - TAGLINE_IN_DELAY,
			fps,
			config: {damping: 18, stiffness: 140, mass: 1.0},
		});

		const logoOpacity = interpolate(f, [LOGO_IN_DELAY - 8, LOGO_IN_DELAY + 6], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const nameOpacity = interpolate(f, [NAME_IN_DELAY - 10, NAME_IN_DELAY + 8], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const taglineOpacity = interpolate(
			f,
			[TAGLINE_IN_DELAY - 10, TAGLINE_IN_DELAY + 10],
			[0, 1],
			{
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			}
		);

		const logoY = (1 - logoIn) * Math.max(30, Math.round(height * 0.05));
		const nameY = (1 - nameIn) * Math.max(22, Math.round(height * 0.035));
		const taglineY = (1 - taglineIn) * Math.max(18, Math.round(height * 0.03));

		const logoScale = 0.88 + logoIn * 0.12;

		const underlineGrow = spring({
			frame: f - (NAME_IN_DELAY + 10),
			fps,
			config: {damping: 20, stiffness: 160},
		});
		const underlineWidth = Math.max(120, Math.round(width * 0.18)) * underlineGrow;

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: GRID_GAP,
						alignItems: "flex-start",
						width: "100%",
						maxWidth: Math.max(900, Math.round(width * 0.82)),
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: Math.max(18, Math.round(width * 0.02)),
							width: "100%",
							flexWrap: "wrap",
						}}
					>
						<div
							style={{
								width: LOGO_SIZE,
								height: LOGO_SIZE,
								borderRadius: 0,
								backgroundColor: "transparent",
								border: "none",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								transform: `translateY(${logoY}px) scale(${logoScale})`,
								opacity: logoOpacity,
								boxShadow: "none",
								overflow: "visible",
							}}
						>
							<Img
								src={AttachedImages[0]}
								style={{
									width: "78%",
									height: "78%",
									objectFit: "contain",
								}}
							/>
						</div>

						<div style={{flex: 1, minWidth: Math.max(260, Math.round(width * 0.28))}}>
							<div
								style={{
									fontSize: TITLE_SIZE,
									fontWeight: 800,
									letterSpacing: -1.2,
									lineHeight: 1.05,
									color: COLOR_TEXT,
									transform: `translateY(${nameY}px)`,
									opacity: nameOpacity,
								}}
							>
								{APP_NAME_TEXT}
							</div>

							<div
								style={{
									marginTop: Math.max(10, Math.round(height * 0.012)),
									height: Math.max(4, Math.round(height * 0.004)),
									width: underlineWidth,
									background: `linear-gradient(90deg, ${COLOR_ACCENT}, rgba(110,231,255,0))`,
									borderRadius: 999,
									opacity: nameOpacity,
								}}
							/>
						</div>
					</div>

					<div
						style={{
							fontSize: TAGLINE_SIZE,
							fontWeight: 600,
							lineHeight: 1.25,
							color: COLOR_MUTED,
							transform: `translateY(${taglineY}px)`,
							opacity: taglineOpacity,
							maxWidth: Math.max(520, Math.round(width * 0.62)),
						}}
					>
						{TAGLINE_TEXT}
					</div>
				</div>
			</AbsoluteFill>
		);
	};

	const SceneTwo = () => {
		/*
		 * Scene 2: Value prop + feature chips and a CTA with a subtle pulse.
		 * A diagonal accent sweep passes over the CTA to add a polished “finish” moment.
		 */

		const f = useCurrentFrame();

		const headlineIn = spring({
			frame: f - SCENE_2_HEADLINE_DELAY,
			fps,
			config: {damping: 18, stiffness: 130},
		});
		const chipsIn = spring({
			frame: f - SCENE_2_CHIPS_DELAY,
			fps,
			config: {damping: 18, stiffness: 120},
		});
		const ctaIn = spring({
			frame: f - SCENE_2_CTA_DELAY,
			fps,
			config: {damping: 14, stiffness: 180},
		});

		const headlineOpacity = interpolate(
			f,
			[SCENE_2_HEADLINE_DELAY - 10, SCENE_2_HEADLINE_DELAY + 10],
			[0, 1],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		const chipsOpacity = interpolate(
			f,
			[SCENE_2_CHIPS_DELAY - 10, SCENE_2_CHIPS_DELAY + 10],
			[0, 1],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		const ctaOpacity = interpolate(
			f,
			[SCENE_2_CTA_DELAY - 10, SCENE_2_CTA_DELAY + 10],
			[0, 1],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		const headlineY = (1 - headlineIn) * Math.max(26, Math.round(height * 0.04));
		const chipsY = (1 - chipsIn) * Math.max(22, Math.round(height * 0.03));
		const ctaY = (1 - ctaIn) * Math.max(18, Math.round(height * 0.028));

		const ctaPulse = interpolate(
			f,
			[SCENE_2_CTA_DELAY + 10, SCENE_2_CTA_DELAY + 18, SCENE_2_CTA_DELAY + 28],
			[1, 1.05, 1],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		const sweepX = interpolate(
			f,
			[SWEEP_START_DELAY, SWEEP_START_DELAY + SWEEP_DURATION],
			[-Math.max(260, Math.round(width * 0.24)), Math.max(900, Math.round(width * 0.9))],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		const chipItems = [
			{label: "Smart invoices", delay: 0},
			{label: "Expense tracking", delay: 5},
			{label: "Instant reports", delay: 10},
		];

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: Math.max(900, Math.round(width * 0.82)),
						display: "flex",
						flexDirection: "column",
						gap: GRID_GAP,
					}}
				>
					<div
						style={{
							fontSize: BODY_SIZE,
							fontWeight: 700,
							color: COLOR_TEXT,
							letterSpacing: -0.4,
							lineHeight: 1.2,
							transform: `translateY(${headlineY}px)`,
							opacity: headlineOpacity,
							maxWidth: Math.max(640, Math.round(width * 0.72)),
						}}
					>
						{VALUE_LINE_TEXT}
					</div>

					<div
						style={{
							display: "flex",
							gap: CHIP_GAP,
							flexWrap: "wrap",
							alignItems: "center",
							transform: `translateY(${chipsY}px)`,
							opacity: chipsOpacity,
						}}
					>
						{chipItems.map((item, i) => {
							const chipIn = spring({
								frame: f - (SCENE_2_CHIPS_DELAY + item.delay),
								fps,
								config: {damping: 18, stiffness: 140},
							});
							const chipOpacity = interpolate(
								f,
								[
									SCENE_2_CHIPS_DELAY + item.delay - 10,
									SCENE_2_CHIPS_DELAY + item.delay + 10,
								],
								[0, 1],
								{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
							);
							const chipY = (1 - chipIn) * Math.max(16, Math.round(height * 0.02));
							const chipScale = 0.98 + chipIn * 0.02;

							return (
								<div
									key={`${item.label}-${i}`}
									style={{
										padding: `${CHIP_PAD_Y}px ${CHIP_PAD_X}px`,
										borderRadius: 999,
										backgroundColor: "rgba(255,255,255,0.06)",
										border: "1px solid rgba(255,255,255,0.12)",
										color: COLOR_TEXT,
										fontSize: CHIP_TEXT_SIZE,
										fontWeight: 600,
										transform: `translateY(${chipY}px) scale(${chipScale})`,
										opacity: chipOpacity,
										whiteSpace: "nowrap",
									}}
								>
									<span style={{color: COLOR_ACCENT, marginRight: 8}}>●</span>
									{item.label}
								</div>
							);
						})}
					</div>

					<div
						style={{
							marginTop: Math.max(6, Math.round(height * 0.008)),
							display: "flex",
							alignItems: "center",
							justifyContent: "flex-start",
						}}
					>
						<div
							style={{
								position: "relative",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								padding: `${CTA_PAD_Y}px ${CTA_PAD_X}px`,
								borderRadius: CTA_RADIUS,
								background: `linear-gradient(135deg, rgba(110,231,255,0.25), rgba(255,255,255,0.06))`,
								border: "1px solid rgba(110,231,255,0.35)",
								color: COLOR_TEXT,
								fontSize: CTA_TEXT_SIZE,
								fontWeight: 800,
								letterSpacing: -0.2,
								transform: `translateY(${ctaY}px) scale(${ctaPulse})`,
								opacity: ctaOpacity,
								boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									top: -Math.max(30, Math.round(height * 0.04)),
									left: sweepX,
									width: Math.max(140, Math.round(width * 0.12)),
									height: Math.max(180, Math.round(height * 0.22)),
									background:
										"linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.20), rgba(255,255,255,0))",
									transform: "rotate(18deg)",
									opacity: interpolate(
										f,
										[SWEEP_START_DELAY, SWEEP_START_DELAY + 8, SWEEP_START_DELAY + SWEEP_DURATION],
										[0, 1, 0],
										{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
									),
									pointerEvents: "none",
								}}
							/>
							<span style={{position: "relative"}}>{CTA_TEXT}</span>
						</div>
					</div>
				</div>
			</AbsoluteFill>
		);
	};

	const SceneThree = () => {
		/*
		 * Scene 3: Final CTA slide.
		 * Minimal, premium finish: centered logo + big “Try it now!” with a soft pulse.
		 */

		const f = useCurrentFrame();

		const inSpring = spring({
			frame: f - 6,
			fps,
			config: {damping: 16, stiffness: 160, mass: 0.9},
		});

		const opacity = interpolate(f, [0, 16], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const y = (1 - inSpring) * Math.max(26, Math.round(height * 0.04));

		const pulse = interpolate(f, [24, 36, 54], [1, 1.04, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const logoScale = 0.92 + inSpring * 0.08;

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: Math.max(900, Math.round(width * 0.82)),
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						textAlign: "center",
						gap: Math.max(18, Math.round(height * 0.022)),
						transform: `translateY(${y}px)`,
						opacity,
					}}
				>
					<div
						style={{
							width: Math.max(96, Math.round(width * 0.12)),
							height: Math.max(96, Math.round(width * 0.12)),
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transform: `scale(${logoScale})`,
							opacity,
						}}
					>
						<Img
							src={AttachedImages[0]}
							style={{
								width: "78%",
								height: "78%",
								objectFit: "contain",
							}}
						/>
					</div>

					<div
						style={{
							fontSize: Math.max(56, Math.round(width * 0.075)),
							fontWeight: 900,
							letterSpacing: -1.2,
							lineHeight: 1.02,
							color: COLOR_TEXT,
							transform: `scale(${pulse})`,
							opacity,
						}}
					>
						{FINAL_CTA_TEXT}
					</div>

					<div
						style={{
							fontSize: TAGLINE_SIZE,
							fontWeight: 600,
							color: COLOR_MUTED,
							maxWidth: Math.max(560, Math.round(width * 0.62)),
							opacity,
						}}
					>
						Start in minutes. Stay on top of your numbers.
					</div>

					<div
						style={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							padding: `${CTA_PAD_Y}px ${CTA_PAD_X}px`,
							borderRadius: CTA_RADIUS,
							background: `linear-gradient(135deg, rgba(110,231,255,0.35), rgba(255,255,255,0.06))`,
							border: "1px solid rgba(110,231,255,0.45)",
							color: COLOR_TEXT,
							fontSize: CTA_TEXT_SIZE,
							fontWeight: 900,
							letterSpacing: -0.2,
							boxShadow: "0 16px 40px rgba(0,0,0,0.35)",
							transform: `scale(${pulse})`,
							opacity,
						}}
					>
						Open iAccountant
					</div>
				</div>
			</AbsoluteFill>
		);
	};

	const SceneFourHistogram = () => {
		const f = useCurrentFrame();

		const intro = spring({
			frame: f - 6,
			fps,
			config: {damping: 16, stiffness: 140, mass: 0.9},
		});

		const titleOpacity = interpolate(f, [0, 18], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const chartOpacity = interpolate(f, [10, 28], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const shiftY = (1 - intro) * Math.max(18, Math.round(height * 0.03));

		const series = useMemo(() => {
			const prices = GOLD.data.map((d) => d.price);
			const min = Math.min(...prices);
			const max = Math.max(...prices);
			const span = Math.max(1, max - min);
			return {
				min,
				max,
				span,
			};
		}, []);

		const maxChartWidth = Math.max(980, Math.round(width * 0.9));
		const chartWidth = Math.min(maxChartWidth, width - PADDING * 2);
		const chartHeight = Math.max(360, Math.round(height * 0.42));
		const barCount = GOLD.data.length;
		const barGap = Math.max(8, Math.round(chartWidth * 0.008));
		const barWidth = Math.floor((chartWidth - barGap * (barCount - 1)) / barCount);

		const gridLineCount = 4;
		const gridYs = new Array(gridLineCount + 1).fill(0).map((_, i) => i / gridLineCount);

		const cursorIndex = Math.floor(
			interpolate(f, [18, Math.min(SCENE_4_DURATION - 24, 120)], [0, barCount - 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
			})
		);

		const highlightPulse = interpolate(
			f,
			[40, 54, 70],
			[1, 1.06, 1],
			{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
		);

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "system-ui, sans-serif",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: Math.max(1040, Math.round(width * 0.92)),
						display: "flex",
						flexDirection: "column",
						gap: Math.max(14, Math.round(height * 0.018)),
						transform: `translateY(${shiftY}px)`,
					}}
				>
					<div style={{opacity: titleOpacity}}>
						<div
							style={{
								fontSize: Math.max(44, Math.round(width * 0.05)),
								fontWeight: 900,
								letterSpacing: -1.0,
								lineHeight: 1.05,
								color: COLOR_TEXT,
							}}
						>
							{GOLD.title}
						</div>
						<div
							style={{
								marginTop: 6,
								fontSize: Math.max(18, Math.round(width * 0.018)),
								fontWeight: 650,
								color: COLOR_MUTED,
							}}
						>
							{GOLD.unit}
						</div>
					</div>

					<div
						style={{
							opacity: chartOpacity,
							width: chartWidth,
							height: chartHeight,
							position: "relative",
							borderRadius: 18,
							background:
								"linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
							border: "1px solid rgba(255,255,255,0.08)",
							overflow: "hidden",
							boxShadow: "0 22px 60px rgba(0,0,0,0.35)",
						}}
					>
						{/* soft gold glow inside chart */}
						<div
							style={{
								position: "absolute",
								inset: -40,
								background:
									"radial-gradient(circle at 35% 35%, rgba(245,197,66,0.18), rgba(245,197,66,0) 55%)",
								filter: "blur(10px)",
								opacity: 1,
							}}
						/>

						{/* grid */}
						{gridYs.map((t, i) => {
							const y = Math.round(t * (chartHeight - 1));
							const value = Math.round(series.max - t * series.span);
							return (
								<div
									key={`grid-${i}`}
									style={{
										position: "absolute",
										left: 0,
										right: 0,
										top: y,
										height: 1,
										background: "rgba(255,255,255,0.08)",
									}}
								>
									<div
										style={{
											position: "absolute",
											left: 12,
											top: -12,
											fontSize: Math.max(12, Math.round(width * 0.012)),
											color: "rgba(244,247,255,0.55)",
											fontWeight: 650,
											letterSpacing: 0.2,
										}}
									>
										{value}
									</div>
								</div>
							);
						})}

						{/* bars */}
						<div
							style={{
								position: "absolute",
								left: 18,
								right: 18,
								bottom: 22,
								top: 18,
								display: "flex",
								alignItems: "flex-end",
								gap: barGap,
							}}
						>
							{GOLD.data.map((d, i) => {
								const appearStart = 14 + i * 3;
								const barIn = spring({
									frame: f - appearStart,
									fps,
									config: {damping: 16, stiffness: 130, mass: 0.9},
								});

								const norm = (d.price - series.min) / series.span;
								const targetH = Math.max(8, Math.round(norm * (chartHeight - 84)));
								const h = targetH * barIn;

								const isActive = i === cursorIndex;
								const activeScale = isActive ? highlightPulse : 1;

								const labelOpacity = interpolate(
									f,
									[appearStart + 6, appearStart + 18],
									[0, 1],
									{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
								);

								return (
									<div
										key={d.month}
										style={{
											flex: "0 0 auto",
											width: barWidth,
											display: "flex",
											flexDirection: "column",
											alignItems: "center",
											justifyContent: "flex-end",
											gap: 10,
											transform: `scale(${activeScale})`,
											transformOrigin: "bottom center",
											transition: "transform 150ms linear",
										}}
									>
										<div
											style={{
												width: "100%",
												height: Math.max(2, h),
												borderRadius: 12,
												background: isActive
													? `linear-gradient(180deg, rgba(255,255,255,0.22), ${COLOR_GOLD})`
													: `linear-gradient(180deg, rgba(255,255,255,0.14), rgba(245,197,66,0.8))`,
												boxShadow: isActive
													? `0 18px 40px ${COLOR_GOLD_SOFT}`
													: "0 10px 26px rgba(0,0,0,0.25)",
												border: "1px solid rgba(255,255,255,0.12)",
												position: "relative",
												overflow: "hidden",
											}}
										>
											<div
												style={{
													position: "absolute",
													inset: 0,
													background:
														"linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))",
													transform: `translateX(${interpolate(
														f,
														[appearStart + 10, appearStart + 26],
														[-barWidth * 1.2, barWidth * 1.2],
														{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
													)}px)`,
													opacity: isActive ? 0.7 : 0.25,
												}}
											/>
										</div>

										<div
											style={{
												fontSize: Math.max(12, Math.round(width * 0.012)),
												fontWeight: 700,
												letterSpacing: 0.2,
												color: isActive ? "rgba(245,197,66,0.95)" : "rgba(244,247,255,0.70)",
												opacity: labelOpacity,
											}}
										>
											{d.month}
										</div>

										{isActive ? (
											<div
												style={{
													position: "absolute",
													bottom: 0,
													transform: `translateY(-${Math.max(10, h + 12)}px)`,
													padding: "8px 10px",
													borderRadius: 12,
													background: "rgba(11,16,32,0.85)",
													border: "1px solid rgba(255,255,255,0.10)",
													color: COLOR_TEXT,
													fontSize: Math.max(14, Math.round(width * 0.014)),
													fontWeight: 800,
													letterSpacing: -0.2,
													boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
													opacity: interpolate(
														f,
														[appearStart + 10, appearStart + 22],
														[0, 1],
														{extrapolateLeft: "clamp", extrapolateRight: "clamp"}
													),
												}}
											>
												{d.price}
											</div>
										) : null}
									</div>
								);
							})}
						</div>

						{/* footer hint */}
						<div
							style={{
								position: "absolute",
								left: 16,
								right: 16,
								bottom: 10,
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								pointerEvents: "none",
							}}
						>
							<div
								style={{
									fontSize: Math.max(12, Math.round(width * 0.012)),
									color: "rgba(244,247,255,0.55)",
									fontWeight: 650,
								}}
							>
								2024 monthly close (approx.)
							</div>
							<div
								style={{
									fontSize: Math.max(12, Math.round(width * 0.012)),
									color: "rgba(245,197,66,0.8)",
									fontWeight: 800,
									letterSpacing: 0.2,
									opacity: interpolate(f, [40, 56], [0, 1], {
										extrapolateLeft: "clamp",
										extrapolateRight: "clamp",
									}),
								}}
							>
								Peak: {series.max}
							</div>
						</div>
					</div>
				</div>
			</AbsoluteFill>
		);
	};

	return (
		<AbsoluteFill
			style={{
				backgroundColor: COLOR_BG,
				fontFamily: "system-ui, sans-serif",
				overflow: "hidden",
			}}
		>
			{/* Ambient background glows (always visible from frame 0) */}
			<div
				style={{
					position: "absolute",
					inset: GLOW_INSET,
					opacity: bgGlowOpacity,
					transform: `translate(${subtleParallaxX}px, ${subtleParallaxY}px)`,
				}}
			>
				<div
					style={{
						position: "absolute",
						top: -Math.max(180, Math.round(height * 0.2)),
						left: -Math.max(220, Math.round(width * 0.2)),
						width: Math.max(520, Math.round(width * 0.55)),
						height: Math.max(520, Math.round(width * 0.55)),
						borderRadius: 9999,
						background:
							"radial-gradient(circle at 30% 30%, rgba(110,231,255,0.22), rgba(110,231,255,0))",
						filter: "blur(10px)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						bottom: -Math.max(220, Math.round(height * 0.24)),
						right: -Math.max(260, Math.round(width * 0.24)),
						width: Math.max(620, Math.round(width * 0.62)),
						height: Math.max(620, Math.round(width * 0.62)),
						borderRadius: 9999,
						background:
							"radial-gradient(circle at 60% 60%, rgba(255,255,255,0.14), rgba(255,255,255,0))",
						filter: "blur(14px)",
					}}
				/>
				<div
					style={{
						position: "absolute",
						top: Math.round(height * 0.18),
						right: Math.round(width * 0.1),
						width: Math.max(460, Math.round(width * 0.44)),
						height: Math.max(460, Math.round(width * 0.44)),
						borderRadius: 9999,
						background:
							"radial-gradient(circle at 50% 45%, rgba(245,197,66,0.16), rgba(245,197,66,0))",
						filter: "blur(16px)",
						opacity: interpolate(frame, [0, 40], [0, 1], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}),
					}}
				/>
			</div>

			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={SCENE_1_DURATION}>
					<SceneOne />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_1_DURATION})}
				/>

				<TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
					<TransitionSeries>
						<TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
							<SceneTwo />
						</TransitionSeries.Sequence>
						<TransitionSeries.Transition
							presentation={slide({direction: "from-bottom"})}
							timing={springTiming({
								durationInFrames: 20,
								config: {damping: 200},
							})}
						/>
					</TransitionSeries>
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_2_DURATION})}
				/>

				<TransitionSeries.Sequence durationInFrames={SCENE_3_DURATION}>
					<SceneThree />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({durationInFrames: TRANSITION_3_DURATION})}
				/>

				<TransitionSeries.Sequence durationInFrames={SCENE_4_DURATION}>
					<SceneFourHistogram />
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};
