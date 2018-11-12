#!/usr/bin/env Rscript
optParser <- spicyScript::getDefaultOptionParser()
opt <- optparse::parse_args(optParser)

x <- spicyScript::validateInputJson(
  x = opt[["json"]],
  requiredKeys = c("eset", "output")
)

invisible(file.copy(
  from = x$eset,
  to = x$output,
  overwrite = TRUE
))

