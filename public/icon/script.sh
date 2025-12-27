for f in *.JPG *.JPEG *.PNG *.GIF *.BMP *.WEBP; do
  [ -e "$f" ] || continue
  lower=$(echo "$f" | tr '[:upper:]' '[:lower:]')
  if [ "$f" != "$lower" ]; then
    tmp="__git_tmp__$$"
    git mv "$f" "$tmp" && git mv "$tmp" "$lower"
  fi
done