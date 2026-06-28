export const INDIA_VIEWBOX = '0 0 1000 1000';

export const MAP_CENTER = { x: 500, y: 480 };

export const CATEGORY_ANCHORS: Record<string, { x: number; y: number }> = {
  students: { x: 200, y: 200 },
  farmers: { x: 800, y: 350 },
  women: { x: 300, y: 750 },
  workers: { x: 750, y: 700 },
  entrepreneurs: { x: 150, y: 500 },
  seniors: { x: 600, y: 150 },
};

export interface IndiaLocation {
  id: string;
  name: string;
  path: string;
}

export const indiaLocations: IndiaLocation[] = [
  {
    id: 'india-outline',
    name: 'India',
    path: 'M 400 150 L 450 120 L 500 130 L 550 110 L 600 140 L 650 180 L 700 220 L 720 280 L 750 320 L 780 380 L 800 440 L 820 500 L 810 560 L 780 620 L 740 680 L 700 730 L 650 770 L 600 800 L 550 820 L 500 810 L 450 790 L 400 760 L 360 720 L 320 680 L 280 630 L 250 580 L 230 520 L 220 460 L 230 400 L 250 340 L 280 290 L 320 250 L 360 200 L 400 150 Z',
  },
];
