import type { NextConfig } from 'next';

const nextConfig: NextConfig = process.env.PAGES_BUILD === '1'
  ? {
      output: 'export',
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
      trailingSlash: true,
      images: { unoptimized: true },
      typescript: { tsconfigPath: 'tsconfig.pages.json' },
    }
  : {};

export default nextConfig;
