import {
  trigger,
  animateChild,
  group,
  transition,
  animate,
  style,
  query,
} from "@angular/animations";

const optional = { optional: true };
let toTheRight = [
  query(
    ":enter, :leave",
    [
      style({
        position: "absolute",
        top: "0",
        right: 0,
        width: "100%",
      }),
    ],
    optional
  ),
  query(":enter", [style({ right: "-100%" })]),
  group([
    query(
      ":leave",
      [animate("300ms ease", style({ right: "100%" }))],
      optional
    ),
    query(":enter", [animate("300ms ease", style({ right: "0%" }))]),
  ]),
];

// Routable animations
export const slideInAnimation = trigger("routeAnimations", [
  transition("isLogin => isUserDashboard", toTheRight),
  transition("isLogin => isAdminDashboard", toTheRight),
  transition("* => isLogin", toTheRight),
]);
