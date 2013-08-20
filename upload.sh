
VERSION_NODE=0.116.0

basepath="/public_html/"

srcs=()
files+=("upsilon-mobileWeb/bin/upsilon-mobileWeb.apk releases/apk/");
files+=("upsilon-web/upsilon-web-tgz/target/upsilon-web-1.2.0.tar.gz releases/upsilon-web-tgz/");
files+=("upsilon-node/upsilon-rpm-fedora18/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-1.fc18.noarch.rpm releases/rpm-fedora18/");
files+=("upsilon-node/upsilon-rpm-fedora18/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-1.fc18.noarch.rpm repositories/rpm-fedora18/");

files+=("upsilon-node/upsilon-rpm-generic/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-generic.noarch.rpm releases/rpm-generic/");
files+=("upsilon-node/upsilon-rpm-generic/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-generic.noarch.rpm repositories/rpm-generic/");

files+=("upsilon-node/upsilon-rpm-rhel6/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-1.el6.noarch.rpm releases/rpm-rhel6/");
files+=("upsilon-node/upsilon-rpm-rhel6/target/rpm/upsilon-node/RPMS/noarch/upsilon-node-${VERSION_NODE}-1.el6.noarch.rpm repositories/rpm-rhel6/");

files+=("upsilon-node/upsilon-deb/target/upsilon-node-${VERSION_NODE}.deb releases/deb/");
files+=("upsilon-node/upsilon-tgz/target/upsilon-node-${VERSION_NODE}.tar.gz releases/tgz/");

for file in "${files[@]}"; do
	src=`echo "$file" | awk '{print $1}'`
	dst=`echo "$file" | awk '{print $2}'`

	if [ ! -f "$src" ]; then
		echo "Build does not look complete, missing file."
		echo "Filename: $src" 
		exit;
	fi
done

echo "Will upload ${#files[@]} file(s)."
echo

for file in "${files[@]}"; do
	src=`echo "$file" | awk '{print $1}'`
	dst=`echo "$file" | awk '{print $2}'`

	echo "File: $src -> $basepath/$dst"
	echo "put $src" | sftp -b - upsilon-project.co.uk:$basepath/$dst
	echo "-"
done