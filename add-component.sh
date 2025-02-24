if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file_name> <class_name>"
    exit 1
fi

FILE=$1
CLASS=$2
DIR="./src/$FILE"

mkdir "$DIR"

cat >"$DIR/index.js" <<EOL
import { loadTemplate, initShadow } from "/src/util.js";
const template_path = '$DIR/template.html'

async function setup(style_src) {
	const template = await loadTemplate(template_path);

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