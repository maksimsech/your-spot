/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: [
        '@your-spot/auth',
        '@your-spot/database',
        '@your-spot/core',
        '@your-spot/map',
        '@your-spot/map-types',
        '@your-spot/contracts',
    ],
    experimental: {
        serverComponentsExternalPackages: [
            '@turf/turf',
        ],
    },
}

export default nextConfig
