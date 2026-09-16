import type React from "react";
import type { IconProps } from "./primitives";
import {
  AnchorBreath,
  BellRing,
  EyeOpen,
  FeetGround,
  HeartSettle,
  PhoneFeed,
  PressureKnot,
  ScreenPair,
  ThoughtCloud,
  TimelineTicks,
} from "./icons";
import {
  AtomProof,
  BedUnfinished,
  CrowdRow,
  EatWalk,
  EatingElsewhere,
  FeelWorse,
  HalfDay,
  NotElsewhere,
  WhereIsPeace,
  ZenAsked,
} from "./icons-zen";

/** Every metaphor available to a storyboard. Add one line to extend it. */
export const ICONS = {
  anchorBreath: AnchorBreath,
  phoneFeed: PhoneFeed,
  thoughtCloud: ThoughtCloud,
  eyeOpen: EyeOpen,
  bellRing: BellRing,
  feetGround: FeetGround,
  timelineTicks: TimelineTicks,
  pressureKnot: PressureKnot,
  heartSettle: HeartSettle,
  screenPair: ScreenPair,
  zenAsked: ZenAsked,
  eatWalk: EatWalk,
  crowdRow: CrowdRow,
  eatingElsewhere: EatingElsewhere,
  bedUnfinished: BedUnfinished,
  atomProof: AtomProof,
  halfDay: HalfDay,
  feelWorse: FeelWorse,
  whereIsPeace: WhereIsPeace,
  notElsewhere: NotElsewhere,
} satisfies Record<string, React.FC<IconProps>>;

export type IconName = keyof typeof ICONS;
