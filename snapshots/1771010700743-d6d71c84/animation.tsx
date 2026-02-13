import React from "react";
import {
	useCurrentFrame,
	useVideoConfig,
	AbsoluteFill,
	interpolate,
	spring,
} from "remotion";
import { Img } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

export const MyAnimation = () => {
	/*
	 * Intro animation for iAccountant using the provided logo as the hero element.
	 * The sequence builds a premium brand moment: logo + wordmark entrance, then a feature/value line and CTA.
	 * Motion is layered (scale/position/opacity + highlight sweep) with smooth scene transitions.
	 */

	const frame = useCurrentFrame();
	const { fps, width, height } = useVideoConfig();

	// COLORS
	const COLOR_BG = "#0B1020";
	const COLOR_CARD = "rgba(255,255,255,0.08)";
	const COLOR_TEXT = "#F4F7FF";
	const COLOR_MUTED = "rgba(244,247,255,0.72)";
	const COLOR_ACCENT = "#6EE7FF";

	// TEXT
	const APP_NAME_TEXT = "iAccountant";
	const TAGLINE_TEXT = "Invoices. Expenses. Reports. Done.";
	const VALUE_LINE_TEXT = "Your clean, fast accounting companion.";
	const CTA_TEXT = "Get started";

	// TIMING
	const SCENE_1_DURATION = 95;
	const TRANSITION_1_DURATION = 16;
	const SCENE_2_DURATION = 95;

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
	const CARD_RADIUS = Math.max(24, Math.round(width * 0.02));
	const MAX_CONTENT_WIDTH = Math.max(900, Math.round(width * 0.82));

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

	const CARD_PAD_Y = Math.max(28, Math.round(height * 0.05));
	const CARD_PAD_X = Math.max(26, Math.round(width * 0.04));

	const CTA_PAD_Y = Math.max(12, Math.round(height * 0.016));
	const CTA_PAD_X = Math.max(18, Math.round(width * 0.02));
	const CTA_RADIUS = Math.max(14, Math.round(width * 0.014));

	// Calculations & derived values (global ambient)
	const bgGlowOpacity = interpolate(frame, [0, 25], [0.0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const subtleParallaxX = interpolate(frame, [0, SCENE_1_DURATION + SCENE_2_DURATION], [-18, 18], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const subtleParallaxY = interpolate(frame, [0, SCENE_1_DURATION + SCENE_2_DURATION], [14, -14], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	const SceneOne = () => {
		/*
		 * Scene 1: Brand reveal. Logo pops in with depth, followed by the app name and a crisp tagline.
		 * A gentle card lift and a small accent underline add hierarchy without clutter.
		 */

		const f = useCurrentFrame();

		const cardIn = spring({
			frame: f,
			fps,
			config: { damping: 18, stiffness: 120, mass: 0.9 },
		});

		const logoIn = spring({
			frame: f - LOGO_IN_DELAY,
			fps,
			config: { damping: 14, stiffness: 180, mass: 0.8 },
		});

		const nameIn = spring({
			frame: f - NAME_IN_DELAY,
			fps,
			config: { damping: 16, stiffness: 160, mass: 0.9 },
		});

		const taglineIn = spring({
			frame: f - TAGLINE_IN_DELAY,
			fps,
			config: { damping: 18, stiffness: 140, mass: 1.0 },
		});

		const cardOpacity = interpolate(f, [0, 14], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const logoOpacity = interpolate(f, [LOGO_IN_DELAY - 8, LOGO_IN_DELAY + 6], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const nameOpacity = interpolate(f, [NAME_IN_DELAY - 10, NAME_IN_DELAY + 8], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const taglineOpacity = interpolate(f, [TAGLINE_IN_DELAY - 10, TAGLINE_IN_DELAY + 10], [0, 1], {
			extrapolateLeft: "clamp",
			extrapolateRight: "clamp",
		});

		const logoY = (1 - logoIn) * Math.max(30, Math.round(height * 0.05));
		const nameY = (1 - nameIn) * Math.max(22, Math.round(height * 0.035));
		const taglineY = (1 - taglineIn) * Math.max(18, Math.round(height * 0.03));

		const logoScale = 0.88 + logoIn * 0.12;
		const cardY = (1 - cardIn) * Math.max(40, Math.round(height * 0.06));
		const cardScale = 0.98 + cardIn * 0.02;

		const underlineGrow = spring({
			frame: f - (NAME_IN_DELAY + 10),
			fps,
			config: { damping: 20, stiffness: 160 },
		});
		const underlineWidth = Math.max(120, Math.round(width * 0.18)) * underlineGrow;

		const logoShadow = `0 ${Math.round(height * 0.014)}px ${Math.round(
			height * 0.05
		)}px rgba(0,0,0,0.45)`;

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "Inter, sans-serif",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: MAX_CONTENT_WIDTH,
						borderRadius: CARD_RADIUS,
						padding: `${CARD_PAD_Y}px ${CARD_PAD_X}px`,
						backgroundColor: COLOR_CARD,
						border: "1px solid rgba(255,255,255,0.10)",
						boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
						transform: `translateY(${cardY}px) scale(${cardScale})`,
						opacity: cardOpacity,
						backdropFilter: "blur(10px)",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: GRID_GAP,
							alignItems: "flex-start",
							width: "100%",
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
									src={"https://raw.githubusercontent.com/dumitruPuggle/motion-iaccountant/main/uploads/1771010620853-c2575eab/asset-1.png"}
									style={{
										width: "78%",
										height: "78%",
										objectFit: "contain",
									}}
								/>
							</div>

							<div style={{ flex: 1, minWidth: Math.max(260, Math.round(width * 0.28)) }}>
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
			config: { damping: 18, stiffness: 130 },
		});
		const chipsIn = spring({
			frame: f - SCENE_2_CHIPS_DELAY,
			fps,
			config: { damping: 18, stiffness: 120 },
		});
		const ctaIn = spring({
			frame: f - SCENE_2_CTA_DELAY,
			fps,
			config: { damping: 14, stiffness: 180 },
		});

		const headlineOpacity = interpolate(
			f,
			[SCENE_2_HEADLINE_DELAY - 10, SCENE_2_HEADLINE_DELAY + 10],
			[0, 1],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
		);

		const chipsOpacity = interpolate(
			f,
			[SCENE_2_CHIPS_DELAY - 10, SCENE_2_CHIPS_DELAY + 10],
			[0, 1],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
		);

		const ctaOpacity = interpolate(
			f,
			[SCENE_2_CTA_DELAY - 10, SCENE_2_CTA_DELAY + 10],
			[0, 1],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
		);

		const headlineY = (1 - headlineIn) * Math.max(26, Math.round(height * 0.04));
		const chipsY = (1 - chipsIn) * Math.max(22, Math.round(height * 0.03));
		const ctaY = (1 - ctaIn) * Math.max(18, Math.round(height * 0.028));

		const ctaPulse = interpolate(
			f,
			[
				SCENE_2_CTA_DELAY + 10,
				SCENE_2_CTA_DELAY + 18,
				SCENE_2_CTA_DELAY + 28,
			],
			[1, 1.05, 1],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
		);

		const sweepX = interpolate(
			f,
			[SWEEP_START_DELAY, SWEEP_START_DELAY + SWEEP_DURATION],
			[-Math.max(260, Math.round(width * 0.24)), Math.max(900, Math.round(width * 0.9))],
			{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
		);

		const chipItems = [
			{ label: "Smart invoices", delay: 0 },
			{ label: "Expense tracking", delay: 5 },
			{ label: "Instant reports", delay: 10 },
		];

		return (
			<AbsoluteFill
				style={{
					padding: PADDING,
					justifyContent: "center",
					alignItems: "center",
					fontFamily: "Inter, sans-serif",
				}}
			>
				<div
					style={{
						width: "100%",
						maxWidth: MAX_CONTENT_WIDTH,
						borderRadius: CARD_RADIUS,
						padding: `${CARD_PAD_Y}px ${CARD_PAD_X}px`,
						backgroundColor: COLOR_CARD,
						border: "1px solid rgba(255,255,255,0.10)",
						boxShadow: "0 20px 70px rgba(0,0,0,0.35)",
						backdropFilter: "blur(10px)",
					}}
				>
					<div style={{ display: "flex", flexDirection: "column", gap: GRID_GAP }}>
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
									config: { damping: 18, stiffness: 140 },
								});
								const chipOpacity = interpolate(
									f,
									[
										SCENE_2_CHIPS_DELAY + item.delay - 10,
										SCENE_2_CHIPS_DELAY + item.delay + 10,
									],
									[0, 1],
									{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
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
										<span style={{ color: COLOR_ACCENT, marginRight: 8 }}>●</span>
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
											{ extrapolateLeft: "clamp", extrapolateRight: "clamp" }
										),
										pointerEvents: "none",
									}}
								/>
								<span style={{ position: "relative" }}>{CTA_TEXT}</span>
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
				fontFamily: "Inter, sans-serif",
				overflow: "hidden",
			}}
		>
			{/* Ambient background glows (always visible from frame 0) */}
			<div
				style={{
					position: "absolute",
					inset: -PADDING,
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
						background: "radial-gradient(circle at 30% 30%, rgba(110,231,255,0.22), rgba(110,231,255,0))",
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
						background: "radial-gradient(circle at 60% 60%, rgba(255,255,255,0.14), rgba(255,255,255,0))",
						filter: "blur(14px)",
					}}
				/>
			</div>

			<TransitionSeries>
				<TransitionSeries.Sequence durationInFrames={SCENE_1_DURATION}>
					<SceneOne />
				</TransitionSeries.Sequence>

				<TransitionSeries.Transition
					presentation={fade()}
					timing={linearTiming({ durationInFrames: TRANSITION_1_DURATION })}
				/>

				<TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
					<TransitionSeries>
						<TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
							<SceneTwo />
						</TransitionSeries.Sequence>
						<TransitionSeries.Transition
							presentation={slide({ direction: "from-bottom" })}
							timing={springTiming({
								durationInFrames: 20,
								config: { damping: 200 },
							})}
						/>
					</TransitionSeries>
				</TransitionSeries.Sequence>
			</TransitionSeries>
		</AbsoluteFill>
	);
};