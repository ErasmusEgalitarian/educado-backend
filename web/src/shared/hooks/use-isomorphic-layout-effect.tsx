"use client";

import * as React from "react";

export const useIsomorphicLayoutEffect =
  typeof globalThis.window !== "undefined" ? React.useLayoutEffect : React.useEffect;