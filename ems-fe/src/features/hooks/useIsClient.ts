'use client';

import { useState } from 'react';

export function useIsClient() {
  return useState(true)[0];
}