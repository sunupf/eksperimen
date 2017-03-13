#!/bin/sh
basedir=$(dirname "$(echo "$0" | sed -e 's,\\,/,g')")

case `uname` in
    *CYGWIN*) basedir=`cygpath -w "$basedir"`;;
esac

if [ -x "$basedir/node" ]; then
  "$basedir/node"  "$basedir/../coba/bin/coba-init" "$@"
  ret=$?
else 
  node  "$basedir/../coba/bin/coba-init" "$@"
  ret=$?
fi
exit $ret
