const { i18n } = require("./next-i18next.config");
const path = require("path");
const fs = require("fs");
const TerserPlugin = require("terser-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
module.exports = {
  i18n,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true
  },
  async rewrites() {
    return [
      {
        source: "/inviteRegister",
        destination: "/register"
      },
      {
        source: "/fm/introduction/regular",
        destination: "/finance/introduction/regular"
      },
      {
        source: "/fm/regular",
        destination: "/finance/crypto_fixed_return"
      }
    ];
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  webpack: (config, { dev, isServer }) => {
    config.module.rules.push({
      oneOf: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          include: resolveApp("src"),
          loader: require.resolve("babel-loader"),
          options: {
            customize: require.resolve("babel-preset-react-app/webpack-overrides"),

            plugins: [
              [
                require.resolve("babel-plugin-named-asset-import"),
                {
                  loaderMap: {
                    svg: {
                      ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]"
                    }
                  }
                }
              ]
            ],
            // This is a feature of `babel-loader` for webpack (not Babel itself).
            // It enables caching results in ./node_modules/.cache/babel-loader/
            // directory for faster rebuilds.
            cacheDirectory: true,
            // See #6846 for context on why cacheCompression is disabled
            cacheCompression: false,
            compact: true
          }
        }
      ]
    });

    if (!dev && !isServer) {
      config.optimization.minimizer = [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            }
          }
        })
      ];
    }
    return config;
  },
  images: {
    domains: [
      "ccfox-pro.oss-ap-southeast-1.aliyuncs.com",
      "cccfox-test.oss-cn-hongkong.aliyuncs.com"
    ],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  }
};
