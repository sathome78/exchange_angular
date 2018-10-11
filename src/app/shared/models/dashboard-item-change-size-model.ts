/**
 * Class model for change dashboard item size
 */
export class DashboardItemChangeSize {
  constructor(
    public itemName: string,
    public widthOrHeight: string,
    public isIncrement: boolean
  ) {}
}
