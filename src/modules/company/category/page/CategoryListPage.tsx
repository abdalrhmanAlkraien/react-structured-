import {AddButton} from "../../../../common/component/common/AddButton.tsx";
import {CategoryListComponent} from "../component/CategoryListComponent.tsx";

export function CategoryListPage() {

    return (
        <div>

            <div className="page-header">
                <h1>Category</h1>

                <div style={{display: "flex", gap: 8}}>
                    <AddButton
                        label="Add Category"
                        to="/company/categories/create"
                    />
                </div>
            </div>

            <CategoryListComponent/>
        </div>
    )
}