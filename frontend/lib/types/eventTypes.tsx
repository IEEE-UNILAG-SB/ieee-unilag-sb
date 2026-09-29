export interface EventCardType {
    id: string,
    image: string,
    title: string,
    description: string,
    location: string,
    registration_link?: string,
}
export interface EventsSectionProps {
    data: EventCardType
}