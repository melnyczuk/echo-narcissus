import { describe, it } from 'globalthis/implementation';

import * as moveNet from './moveNet';

describe('moveNet',()=>{
  describe('run', () => {
    it('runs', async () => {
      const data = new ImageData(192,192);
      const poses = await moveNet.run(data as unknown as HTMLVideoElement);
      expect(poses).toHaveLength(1);
      expect(poses[0].score).toBe(0);
      expect(poses[0].keypoints).toHaveLength(17);
    });
  });
});
