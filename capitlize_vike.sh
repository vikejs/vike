git ls-files | grep -Ev '\.(svg|png)$' | xargs perl -pi -e "s/(?<=\s|^)vike(?=\s|,|\.|'|\"|\]|$)/Vike/g"

# Check whether an occurence is missing
# git ls-files | grep -Ev '\.(svg|png)$' | xargs perl -pi -e 's/\bvike(?=\s)/Vike/g'
# git ls-files | grep -Ev '\.(svg|png)$' | xargs perl -pi -e 's/(?<=\s)vike\b/Vike/g'

# Fixup
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/\$ Vike/$ vike/g'
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/Vike prerender/vike prerender/g'
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/npm create Vike/npm create vike/g'
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/yarn create Vike/yarn create vike/g'
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/npm init Vike/npm init vike/g'
git ls-files | grep -Ev '\.(svg|png)$' | xargs sed -i 's/yarn init Vike/yarn init vike/g'
