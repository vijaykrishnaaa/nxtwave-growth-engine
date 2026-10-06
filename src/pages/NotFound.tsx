import { ButtonLink, EmptyState } from '../components/ui'

export default function NotFound() {
  return (
    <div className="container section">
      <p className="t-eyebrow">404</p>
      <h1 className="t-display-l">This page isn’t on the schedule.</h1>
      <EmptyState title="Nothing here" action={<ButtonLink to="/" arrow>Back to the workshop</ButtonLink>}>
        The link may be mistyped. Invite links look like <span className="t-mono">/?ref=CODE</span>.
      </EmptyState>
    </div>
  )
}
