type selectType = {
    setValue: React.Dispatch<React.SetStateAction<string>>;
}


export function FilterSelect({ setValue }: selectType) {

    return (
        <div>
            <select className="form-select" onChange={(e) => setValue(e.target.value)}>
                <option value="all">ყველა</option>
                <option value="Head Office">მთავარი ოფისი</option>
                <option value="Cavea Tbilisi Mall">კავეა თბილისი მოლი</option>
                <option value="Cavea City Mall">კავეა სითი მოლი</option>
                <option value="Cavea East Point">კავეა ისთ ფოინთი</option>
                <option value="Cavea Gallery">კავეა გალერეა</option>
            </select>
        </div>
    )
}
