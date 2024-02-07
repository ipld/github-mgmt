# Purpose
This is intended to accompany https://github.com/ipld/github-mgmt/pull/65.
I did it as its own file to enable threaded replies on specific lines/sections of this file with the PR UI.
If I didn't do this, we'd be limited to quote replies in https://github.com/ipld/github-mgmt/pull/65.
Given that I expect a decent amount of back-and-forth on some of these suggestions, I figured quote replies would get unweildy.
I'm not assuming this file will get checked in.  It's purely to help with the code review process.
Maybe at the end if there is useful content here, we copy/paste it into the PR itself.  (Alternatively we could merge it in.)
Or I guess we could just move into Github discussions?  (I didn't do that because wanted to keep all the context here.)
Obivously I could have done this in another tool like Google Docs, but I wanted to keep the discussion more open and discoverable (especially since this will the basis for changes to libp2p, ipfs, etc. repos).
If I should do something else, please let me know!

# General github-mgmt feedback/wishes
## Documentation I wish was more readily accessible when using github-mgmt
Below are links or lookups I wish more readily available when engaging with github-mgmt.  
I find myself looking them up each time I'm thinking about github-mgmt.  
I didn't see them in https://github.com/ipld/github-mgmt/tree/master/docs.  

* Org-level permissions: https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization#permissions-for-organization-roles
* Org base permissions: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/setting-base-permissions-for-an-organization#setting-base-permissions
* Permissions for each repository role: https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-repository-roles/repository-roles-for-an-organization#permissions-for-each-role 
* Difference between team maintainer vs. member: https://docs.github.com/en/organizations/organizing-members-into-teams/assigning-the-team-maintainer-role-to-a-team-member

Reminders I wish were more present:
* Terraform “push” corresponds with Github “write”.
* Terraform “pull” corresponds with Github “read”.
* Terraform members.admin correspond with Github "org owner" per https://registry.terraform.io/providers/integrations/github/latest/docs/resources/membership

## User-oriented view of changes
I came at this again independently, but I would like something like was expressed in https://github.com/libp2p/github-mgmt/pull/12#pullrequestreview-999621620.

I think we should have some tooling that answers: "after these changes, what repos do I have permissions for, what permissions do I have, and why (because part of a team, or direct repo)".

At the minimum, when we tag users we need to make clear that just because they’re tagged, that doesn’t mean that they are removed from the org.  
Their access to certain repos / teams is what is being changed.  People need to look at the diff to see specifically.
https://github.com/libp2p/github-mgmt/pull/12#pullrequestreview-999621620 speaks to how there was confusion when folks were @mentioned and that they thought they were being removed from the org.

Even if we don't give the full user-oriented view of one's permissions, it would be great if we gave a user-oriented summary of the changes.  Example:

```
@biglep
Removed from repos: repoName1/permissoinLevel1, repoName2/permissoinLevel2
Removed from teams: team1
```

That by itself will cut down on some of the confusion, but it will still need a disclaimer (e.g., "Even though your direct repo permissions have been removed, you may still have access through a team.  Please check the full diff.").

## More intelligent sorting of keys
I wish github-mgmt didn’t sort all key alphabetically when there is a more meaningful default.  
For example, with "collaborators” and “teams”, I want the keys be in descencing order: admin > maintain > push > triage > pull.
Similarly, I want crucial properties like "archived" to be at the top.
I think the default otherwise can be alphabetical.
(Implementation wise I assume we do a custom sort function that pulls out any specific keys, sorts by that specified order, puts those first, and then adds the rest of the keys alphabetically.)

# Somewhere between general and IPLD-specific
These are at least things that apply to the 2024Q1 cleanup for ipld, libp2p, and ipfs orgs. Some of them can be generalized.

## Archived repos cause clutter
These .yaml files can be unwieldy.  One thing I think could help would be to have a view on all the repos that aren't archived.  Some ideas (I assume from least to most amount of work):
* Put all the archived repos at the bottom of the file.  (I still don't like this one as much because archived repos will show up when doing text search for "team X" when trying to answer "what teams does X have permissions to").
* Have an optional separate .yaml that merges in at build/process time.  This would allow a dedicated separate file (e.g., archived_repos.yaml).
  * Generalizing this, maybe github-mgmt can be configured to do a merge of any specified files, which lets repo organizers decide if/how they want to break up their yaml file in general?
* Go the IPFS route and actually have an "ipfs-inactive" org.  Archived projects can get moved there.  This makes things very clear about the maintenance status and also solves the declutter problem. 

## Strip out access permissions to archived repos
It adds clutter having individuals and teams showing up with access permissions in archived repos.  
If a repo is archived, I think we should strip permissions.  
Someone can always unarchive and add permissions through github-mgmt.  
In addition to this reducing clutter, I this proposed process is good because it gives clear visibility to a significant repo event (e.g., unarchiving).

## Remove the w3dt-stewards team
That is legacy both in terms of name and function.
It was used when there was a small team who was charged with looking after the whole github org and they didn't have github-mgmt at their disposal.
In PLv10 / PL Innovation Network era, there is no corrolary for this.
If broad action is needed, it can be done broadly via github-mgmt.  And where it can't be done directly with github-mgmt, github-mgmt can at least be done to give broad permissions to go do the broad action.

## Default access of the ipdx team
It looks like the ipdx team has admin permissions on most repos.   
Should we maybe reduce this and instead ensure they just have github-mgmt admin access, which still enables them to "break glass" and escalate their access when needed?

## Commit/PR order
If some of the feedback above is incorporated, I'm wondering if we should do commits or PRs in this order to help make the consequential changes more clear.
1. Remove access permissions of users/teams to archived reports.
2. Factor out archived repos.
3. Remove teams like w3dt-stewards
4. Reduce ipdx access
5. (Anything related to renaming team names)
6. Other changes that the IPDX scripts picks up based on audit log inactivity and based on additional manual changes.  (This is the diff we need people to be scrutinizing.)

# IPLD specifics
## Org admins
At the minimum, this should be reduced to just a few.  I made a commit as a first pass: https://github.com/ipld/github-mgmt/pull/65/commits/5d21c43365e48ab589628e8b25188a70e443b8ad
I wondered if we should go further by reduce the org owners to zero, and rely on escalation via github-mgmt in the rare cases where this is needed?
It looks like it's encouraged that we just have a few per https://docs.github.com/en/organizations/managing-peoples-access-to-your-organization-with-roles/roles-in-an-organization#organization-owners, so maybe the current proposal in the PR is good.

## Base permission
✅ We look to be at "no permissions" which I agree is best to do to keep things clear and easy to reason about.  One's permissions have to be increased from nothing based on what's in github-mgmt. 

## Alumni Team
✅ I agree we want this.  Great to see the script automatically populating it.
