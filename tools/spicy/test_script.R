#!/usr/bin/env Rscript
optParser <- spicyScript::getDefaultOptionParser()

opt <- optparse::parse_args(optParser);

x <- spicyScript::validateInputJson(
  x = opt[["json"]],
  requiredKeys = c("model", "inputs", "output")
)

print(x)

write.table(
  x = iris, 
  file = x$output, 
  append = FALSE,
  quote = FALSE,
  sep = "\t",
  row.names = FALSE
)

