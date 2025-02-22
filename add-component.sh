mkdir  ./public/components/$1

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file_name> <class_name>"
    exit 1
fi

FILE=$1
CLASS=$2

cat >./public/components/$FILE/index.js <<EOL
import util from "/components/util.js";
const template_path = '/components/$FILE/template.html'
const style_path = '/components/$FILE/style.css'

async function setup(style_src) {
	const template = await util.loadTemplate(template_path);

	class $CLASS extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = util.initShadow(this, template, style_src);
			util.applyStyle(shadow, style_path);
		
		}
	}

	return $CLASS
}

export default setup
EOL

touch ./public/components/$FILE/template.html
touch ./public/components/$FILE/style.css