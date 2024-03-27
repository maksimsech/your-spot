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
        ],
    },
    eslint: {
        ignoreDuringBuilds: !!process.env['BUILD_NEXT_ESLINT_IGNORE'],
    },
}

export default nextConfig
