if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file_name> <class_name>"
    exit 1
fi

FILE=$1
CLASS=$2
DIR="./src/$FILE"

mkdir "$DIR"

cat >"$DIR/index.js" <<EOL
import { parseTemplate, initShadow } from "/src/util.js";
import template_html from './template.html?raw'

async function setup(style_src) {
	const template = parseTemplate(template_html);

	class $CLASS extends HTMLDivElement {
		constructor() {
			super();
		}

		connectedCallback() {
			const shadow = initShadow(this, template, style_src);
		
		}
	}

	return $CLASS
}

export default setup
EOL

touch $DIR/template.html