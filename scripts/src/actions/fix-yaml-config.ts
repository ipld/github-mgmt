import 'reflect-metadata'
import {Repository} from '../resources/repository'
import {format} from './shared/format'
import {setPropertyInAllRepos} from './shared/set-property-in-all-repos'
import {toggleArchivedRepos} from './shared/toggle-archived-repos'
import {describeAccessChanges} from './shared/describe-access-changes'

import * as core from '@actions/core'

function isPublic(repository: Repository) {
  return repository.visibility === 'public'
}

async function run() {
  await setPropertyInAllRepos(
    'secret_scanning',
    true,
    r => isPublic(r)
  )
  await setPropertyInAllRepos(
    'secret_scanning_push_protection',
    true,
    r => isPublic(r)
  )
  await toggleArchivedRepos()
  const accessChangesDescription = await describeAccessChanges()
  core.setOutput(
    'comment',
    `The following access changes will be introduced as a result of applying the plan:

<details><summary>Access Changes</summary>

\`\`\`
${accessChangesDescription}
\`\`\`

</details>`
  )
  await format()
}

run()
