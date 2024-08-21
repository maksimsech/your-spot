/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@your-spot/auth',
        '@your-spot/database',
        '@your-spot/core',
        '@your-spot/map',
        '@your-spot/map-types',
        '@your-spot/contracts',
        '@your-spot/storage',
    ],
    experimental: {
        serverComponentsExternalPackages: [
            '@turf/turf',
            '@smithy/util-retry',
            'uuid',
            '@smithy/middleware-retry',
        ],
    },
    eslint: {
        ignoreDuringBuilds: !!process.env['BUILD_NEXT_ESLINT_IGNORE'],
    },
    images: {
        remotePatterns: [{
            protocol: process.env['STORAGE_PUBLIC_IMAGE_URL_PROTOCOL'],
            hostname: process.env['STORAGE_PUBLIC_IMAGE_URL_HOSTNAME'],
            port: '',
            pathname: '/**',
        }],
    },
}

export default nextConfig
