/**
 * @type {import('vite').UserConfig}
 */
export default{
    assetsInclude:['**/*glb'],
    base: process.env.NODE_ENV === 'production' ? '' : '',
    build: {
        chunkSizeWarningLimit: 60000,
        assetsInlineLimit: 0
    }

}