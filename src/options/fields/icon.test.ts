import * as log from 'loglevel';

import { icon } from './icon';
import { inferIcon } from '../../infer/inferIcon';

jest.mock('./../../infer/inferIcon');
jest.mock('loglevel');

const mockedResult = 'icon path';
const ICON_PARAMS_PROVIDED = {
  icon: './icon.png',
  targetUrl: 'https://google.com',
  platform: 'mac',
};
const ICON_PARAMS_NEEDS_INFER = {
  targetUrl: 'https://google.com',
  platform: 'mac',
};

describe('when the icon parameter is passed', () => {
  test('it should return the icon parameter', async () => {
    expect(inferIcon).toHaveBeenCalledTimes(0);
    await expect(icon(ICON_PARAMS_PROVIDED)).resolves.toBe(
      ICON_PARAMS_PROVIDED.icon,
    );
  });
});

describe('when the icon parameter is not passed', () => {
  test('it should call inferIcon', async () => {
    (inferIcon as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve(mockedResult),
    );
    const result = await icon(ICON_PARAMS_NEEDS_INFER);

    expect(result).toBe(mockedResult);
    expect(inferIcon).toHaveBeenCalledWith(
      ICON_PARAMS_NEEDS_INFER.targetUrl,
      ICON_PARAMS_NEEDS_INFER.platform,
    );
  });

  describe('when inferIcon resolves with an error', () => {
    test('it should handle the error', async () => {
      (inferIcon as jest.Mock).mockImplementationOnce(() =>
        Promise.reject(new Error('some error')),
      );
      const result = await icon(ICON_PARAMS_NEEDS_INFER);

      expect(result).toBe(null);
      expect(inferIcon).toHaveBeenCalledWith(
        ICON_PARAMS_NEEDS_INFER.targetUrl,
        ICON_PARAMS_NEEDS_INFER.platform,
      );
      expect(log.warn).toHaveBeenCalledTimes(1);
    });
  });
});
