module.exports = {
	plugins: [require("prettier-plugin-tailwindcss")],
	tailwindConfig: "./tailwind.config.js",
	tabWidth: 4,
	useTabs: true,
	semi: true,
	singleQuote: false,
	trailingComma: "es5",
	bracketSpacing: true,
	jsxBracketSameLine: false,
	arrowParens: "avoid",
	proseWrap: "always",
};
