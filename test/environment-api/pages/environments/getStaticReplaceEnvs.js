export { getStaticReplaceEnvs }

// Its arguments are replaced by +staticReplace
function getStaticReplaceEnvs(...envs) {
  return envs.filter(Boolean)
}
