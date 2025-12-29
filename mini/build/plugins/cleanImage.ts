import CleanBuild from 'vite-plugin-clean-build';

export const CleanImagePlugin = () => {
  return CleanBuild({
    outputDir: 'dist/build/mp-weixin',
    patterns: ['static/images/**', '!static/images/logo.png', '!static/images/tabbar/**'],
  });
};
