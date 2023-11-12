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
}

export default nextConfig
