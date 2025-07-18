import React, {
    ComponentProps,
    FC,
    KeyboardEventHandler,
    MouseEventHandler,
    useEffect, useState
} from 'react'
import cx from 'classnames'
import { EbayNoticeContent } from '../ebay-notice-base/components/ebay-notice-content'
import NoticeContent from '../common/notice-utils/notice-content'
import { EbayIcon, Icon } from '../ebay-icon'
import { EbaySectionNoticeFooter } from './index'
import { randomId } from '../common/random-id'
import { findComponent } from '../utils'

export type SectionNoticeStatus = 'general' | 'none' | 'attention' | 'confirmation' | 'information' | 'education'
export type Props = ComponentProps<'section'> & {
    status?: SectionNoticeStatus;
    'aria-label'?: string;
    'aria-roledescription'?: string;
    className?: string;
    a11yDismissText?: string;
    onDismiss?: MouseEventHandler & KeyboardEventHandler;
    educationIcon?: Icon;
    iconClass?: string;
    prominent?: boolean;
}

const EbaySectionNotice: FC<Props> = ({
    status = 'general',
    children,
    className,
    'aria-label': ariaLabel,
    'aria-roledescription': ariaRoleDescription = 'Notice',
    a11yDismissText,
    educationIcon,
    iconClass,
    prominent,
    onDismiss = () => {},
    ...rest
}) => {
    const [dismissed, setDismissed] = useState(false)

    const [rId, setRandomId] = useState('')

    useEffect(() => {
        setRandomId(randomId())
    }, [])

    const content = findComponent(children, EbayNoticeContent)
    const hasStatus = status !== 'general' && status !== 'none'
    const isEducational = status === 'education'
    let iconName = null

    if (hasStatus) {
        if (isEducational) {
            iconName = educationIcon || 'lightbulb24'
        } else {
            iconName = `${status}Filled16` as Icon
        }
    }

    if (!content) {
        throw new Error(`EbaySectionNotice: Please use a EbayNoticeContent that defines the content of the notice`)
    }

    const handleDismissed: ComponentProps<'button'>['onClick'] = (event) => {
        setDismissed(true)
        onDismiss(event)
    }

    return dismissed ? null : (
        <section
            {...rest}
            className={cx(className, `section-notice`, {
                [`section-notice--${status}`]: hasStatus,
                'section-notice--education': isEducational && prominent,
                'section-notice--large-icon': isEducational
            })}
            aria-label={!hasStatus ? ariaLabel : null}
            aria-labelledby={hasStatus ? `section-notice-${status}-${rId}` : null}
            aria-roledescription={ariaRoleDescription}>
            {iconName && (
                <div className="section-notice__header" id={`section-notice-${status}-${rId}`}>
                    <EbayIcon className={iconClass} name={iconName} a11yText={ariaLabel} a11yVariant="label" />
                </div>
            )}
            <NoticeContent {...content.props} type="section" />
            {children}
            {a11yDismissText && (
                <EbaySectionNoticeFooter>
                    <button
                        aria-label={a11yDismissText}
                        className="fake-link page-notice__dismiss"
                        onClick={handleDismissed}>
                        <EbayIcon name="close16" />
                    </button>
                </EbaySectionNoticeFooter>
            )}
        </section>
    )
}

export default EbaySectionNotice
