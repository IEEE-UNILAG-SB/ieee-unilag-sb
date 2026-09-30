export interface EventCardType {
    id: string,
    image: string,
    title: string,
    description: string,
    date?: string,
    createdAt?: string,
    location: string,
    registration_link?: string,
}
export interface EventsSectionProps {
    data: EventCardType
}