/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true,
    },
    transpilePackages: [
        '@your-spot/database',
        '@your-spot/core',
        '@your-spot/map',
        '@your-spot/map-types',
        '@your-spot/contracts',
    ],
}

export default nextConfig
