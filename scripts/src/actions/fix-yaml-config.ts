import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {format} from './shared/format'
import {setPropertyInAllRepos} from './shared/set-property-in-all-repos'

function isPublic(repository: Repository) {
  return repository.visibility === 'public'
}

setPropertyInAllRepos(
  'secret_scanning',
  true,
  r => isPublic(r)
)
setPropertyInAllRepos(
  'secret_scanning_push_protection',
  true,
  r => isPublic(r)
)
format()
